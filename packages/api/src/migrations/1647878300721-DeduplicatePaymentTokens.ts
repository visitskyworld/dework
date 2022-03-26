import { MigrationInterface, QueryRunner } from "typeorm";
import _ from "lodash";

export class DeduplicatePaymentTokens1647878300721
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Convert all addresses to lowercase
    await queryRunner.query(`
      UPDATE "public"."payment_token" SET address = LOWER(address);
    `);

    const tokens: {
      id: string;
      type: string;
      address: string;
      networkId: string;
      identifier: string;
    }[] = await queryRunner.query(`
      SELECT "id", "type", "address", "networkId", "identifier"
      FROM "payment_token"
      WHERE "address" IS NOT NULL
    `);

    const groupedTokens = _.groupBy(tokens, (t) =>
      [t.address, t.type, t.networkId, t.identifier].join(":")
    );

    for (const tokenGroup of Object.values(groupedTokens)) {
      if (tokenGroup.length === 1) continue;

      const [token, ...tokensToRemove] = tokenGroup;

      console.log("Merging tokens:", { token, tokensToRemove });

      await queryRunner.query(`
        UPDATE "project_token_gate"
        SET "tokenId" = '${token.id}'
        WHERE "tokenId" IN (${tokensToRemove
          .map((t) => `'${t.id}'`)
          .join(",")});
      `);
      await queryRunner.query(`
        UPDATE "task_reward"
        SET "tokenId" = '${token.id}'
        WHERE "tokenId" IN (${tokensToRemove
          .map((t) => `'${t.id}'`)
          .join(",")});
      `);
      await queryRunner.query(`
        UPDATE "payment_method_token" pmt
        SET "paymentTokenId" = '${token.id}'
        WHERE "paymentTokenId" IN (${tokensToRemove
          .map((t) => `'${t.id}'`)
          .join(",")})
          AND NOT EXISTS (
            SELECT 1
            FROM "payment_method_token"
            WHERE "paymentTokenId" = '${token.id}'
              AND "paymentMethodId" = pmt."paymentMethodId"
          )
      `);
      await queryRunner.query(`
          DELETE FROM "payment_method_token"
          WHERE "paymentTokenId" IN (${tokensToRemove
            .map((t) => `'${t.id}'`)
            .join(",")});
      `);

      await queryRunner.query(`
        DELETE FROM "payment_token"
        WHERE id IN (${tokensToRemove.map((t) => `'${t.id}'`).join(",")});
      `);
    }
  }

  public async down(): Promise<void> {}
}
