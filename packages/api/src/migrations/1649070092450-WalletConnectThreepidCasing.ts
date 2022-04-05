import { MigrationInterface, QueryRunner } from "typeorm";
import { ethers } from "ethers";

export class WalletConnectThreepidCasing1649070092450
  implements MigrationInterface
{
  name = "WalletConnectThreepidCasing1649070092450";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const rows: { id: string; address: string; username: string }[] =
      await queryRunner.query(`
			SELECT threepid.id, threepid.threepid AS address, "user".username
			FROM threepid
			LEFT JOIN "user" ON "user"."id" = "threepid"."userId"
			WHERE threepid.source = 'metamask'
				AND LOWER(threepid.threepid) = threepid.threepid
		`);

    for (const row of rows) {
      const address = ethers.utils.getAddress(row.address);
      const existing = await queryRunner.query(`
				SELECT threepid.id, threepid.threepid AS address, "user".username
				FROM threepid
				LEFT JOIN "user" ON "user"."id" = "threepid"."userId"
				WHERE threepid.source = 'metamask'
					AND threepid.threepid = '${address}'
			`);

      if (!existing.length) {
        await queryRunner.query(`
        	UPDATE threepid
        	SET threepid = '${address}'
        	WHERE id = '${row.id}'
        `);
      } else {
        console.log("Address already exists", { existing, address, row });
      }
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
