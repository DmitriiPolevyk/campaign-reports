import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateCampaignReports1741156857696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'campaign_reports',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'campaign',
            type: 'varchar(255)',
          },
          {
            name: 'campaign_id',
            type: 'uuid',
          },
          {
            name: 'adgroup',
            type: 'varchar(255)',
          },
          {
            name: 'adgroup_id',
            type: 'uuid',
          },
          {
            name: 'ad',
            type: 'varchar(255)',
          },
          {
            name: 'ad_id',
            type: 'uuid',
          },
          {
            name: 'client_id',
            type: 'uuid',
          },
          {
            name: 'event_name',
            type: 'varchar(255)',
          },
          {
            name: 'event_time',
            type: 'timestamp',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'campaign_reports',
      new TableUnique({
        name: 'UQ_campaign_reports',
        columnNames: ['event_time', 'client_id', 'event_name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('campaign_reports');
  }
}
