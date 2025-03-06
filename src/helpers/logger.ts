import { join } from 'path';

export default {
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'yyyy-dd-mm, h:MM:ss TT',
      destination:
        process.env.NODE_ENV == 'production'
          ? join(process.cwd(), '/logs/app.log')
          : 1,
      ignore: 'pid,hostname,level',
      singleLine: true,
    },
  },
};
