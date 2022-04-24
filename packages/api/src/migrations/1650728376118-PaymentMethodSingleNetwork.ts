import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentMethodSingleNetwork1650728376118
  implements MigrationInterface
{
  name = "PaymentMethodSingleNetwork1650728376118";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD "networkId" uuid NULL`
    );

    const rows: { methodId: string; networkId: string }[] =
      await queryRunner.query(`
        SELECT
          "paymentMethodId" as "methodId",
          (
              SELECT "paymentNetworkId"
              FROM payment_method_network pmn
              WHERE pmn."paymentMethodId" = payment_method_network."paymentMethodId"
              LIMIT 1
          ) as "networkId"
        FROM payment_method_network
        GROUP BY "paymentMethodId"
      `);

    for (const row of rows) {
      await queryRunner.query(`
        UPDATE "payment_method"
        SET "networkId" = '${row.networkId}'
        WHERE "id" = '${row.methodId}'
      `);
    }

    await queryRunner.query(
      `ALTER TABLE "payment_method" ALTER COLUMN "networkId" SET NOT NULL;`
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD CONSTRAINT "FK_4674a9d81ba43aea4db3bccff47" FOREIGN KEY ("networkId") REFERENCES "payment_network"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(`DROP TABLE "payment_method_network"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP CONSTRAINT "FK_4674a9d81ba43aea4db3bccff47"`
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP COLUMN "networkId"`
    );
  }
}
