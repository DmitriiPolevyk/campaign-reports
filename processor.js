require('dotenv').config();
const { Client } = require('pg');
const pino = require('pino');
const { join } = require('path');

const logger = pino(
  {
    transport:
    {
      target: 'pino-pretty',
      options: {
        translateTime: "yyyy-dd-mm, h:MM:ss TT",
        destination: process.env.NODE_ENV == 'production' ? join(process.cwd(), '/logs/app.log') : 1,
        ignore: 'pid,hostname,level',
        singleLine: true,
      },
    },
  },
);

function generateUrl(params) {
  const url = new URL(process.env.API_URL);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  return url;
}

async function fetchData(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.API_KEY,
      },
    });

    return res.json();
  } catch (error) {
    logger.error({ message: 'Error fetch data', url, error });
  }
}

function csvToObject(csv) {
  const data = csv.split('\n');
  const header = data.shift().split(',');

  return data.map((el) => {
    const parameters = el.split(',');
    return Object.assign(
      {},
      ...parameters.map((el, i) => ({
        [header[i]]: el,
      })),
    );
  });
}

async function insertReports(data, db) {
  const queries = [];
  for (const item of data) {
    queries.push(
      db.query(
        `INSERT INTO campaign_reports (campaign, campaign_id, adgroup, adgroup_id, ad, ad_id, client_id, event_name, event_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT ON CONSTRAINT "UQ_campaign_reports" 
         DO UPDATE 
         SET campaign = $1, campaign_id = $2, adgroup = $3, adgroup_id = $4, ad = $5, ad_id = $6, "createdAt" = NOW()`,
        [
          item.campaign,
          item.campaign_id,
          item.adgroup,
          item.adgroup_id,
          item.ad,
          item.ad_id,
          item.client_id,
          item.event_name,
          item.event_time,
        ],
      ),
    );
  }

  return Promise.all(queries);
}

async function handleJobs(job) {
  const { from_date, to_date, manually } = job.data;
  const message = manually ? `manually` : `cron`;
  const event_names = ['install', 'purchase'];
  const take = 100;
  logger.info({
    message: `Processor: ${message} fetch started`,
    id: job.id,
  });
  const db = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  try {
    await db.connect();
    let total = 0;
    for (const event_name of event_names) {
      let url = generateUrl({ from_date, to_date, event_name, take });
      let cnt = 0;
      while (url) {
        const res = await fetchData(url);
        if (!res?.data?.csv) {
          url = null;
          continue;
        }
        const dataObj = csvToObject(res.data.csv);
        if(dataObj.length) {
          await insertReports(dataObj, db);
          cnt += dataObj.length;
        }
        logger.info({
          message: `Processor: ${cnt} rows inserted for event: ${event_name}`,
          id: job.id,
        });
        url = res.data.pagination ? res.data.pagination.next : null;
      }
      total += cnt;
    }
    logger.info({
      message: `Processor: ${total} total rows inserted`,
      id: job.id,
    });
  } catch (error) {
    logger.error({ message: 'Processor error', id: job.id, error });
  } finally {
    db.end();
  }

  logger.info({
    message: `Processor: ${message} fetch ended`,
    id: job.id,
  });
}

module.exports = async (job) => {
  handleJobs(job);
};
