import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePaymentMethodUser1649004427412
  implements MigrationInterface
{
  name = "RemovePaymentMethodUser1649004427412";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.createThreepids(
      "metamask",
      [
        "avalanche-mainnet",
        "ethereum-kovan",
        "arbitrum-mainnet",
        "fantom-mainnet",
        "sokol-testnet",
        "polygon-mainnet",
        "ethereum-mainnet",
        "bsc-mainnet",
        "harmony-testnet",
        "ethereum-rinkeby",
        "gnosis-chain",
        "optimism-mainnet",
        "fuse-mainnet",
        "harmony-mainnet",
      ],
      queryRunner
    );
    await this.createThreepids(
      "hiro",
      ["stacks-testnet", "stacks-mainnet"],
      queryRunner
    );
    await this.createThreepids(
      "phantom",
      ["solana-testnet", "solana-mainnet"],
      queryRunner
    );
  }

  private async createThreepids(
    source: "metamask" | "hiro" | "phantom",
    networkSlugs: string[],
    queryRunner: QueryRunner
  ) {
    const rows: { userId: string; address: string }[] =
      await queryRunner.query(`
        SELECT payment_method."userId", LOWER(payment_method."address") AS address
        FROM payment_method
        INNER JOIN payment_method_network ON payment_method_network."paymentMethodId" = payment_method.id
        INNER JOIN payment_network ON payment_network.id = payment_method_network."paymentNetworkId"
        INNER JOIN "user" ON "user".id = payment_method."userId"
        LEFT JOIN threepid ON threepid."userId" = "user".id AND threepid.source = '${source}'
        WHERE threepid.id IS NULL
        AND payment_network.slug IN (${networkSlugs.map((slug) => `'${slug}'`)})
        GROUP BY payment_method."userId", LOWER(payment_method."address")
    `);

    for (const row of rows) {
      const threepids = await queryRunner.query(
        `SELECT id FROM threepid WHERE threepid = '${row.address}'`
      );
      if (!!threepids.length) {
        console.warn("Threepid already used", { threepids, row });
        continue;
      }
      await queryRunner.query(
        `
        INSERT INTO threepid ("userId", "threepid", "source", "config")
        VALUES (
          '${row.userId}',
          '${row.address}',
          '${source}',
          CAST('{"migration": "${this.name}"}' AS json)
        )
        `
      );
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
