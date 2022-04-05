import { MigrationInterface, QueryRunner } from "typeorm";
import { ethers } from "ethers";

export class TokenAddressCasing1649161088418 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tokens: { id: string; address: string }[] = await queryRunner.query(`
			SELECT id, address
			FROM payment_token
			WHERE type IN ('ERC20', 'ERC721', 'ERC1155')			
		`);

    for (const token of tokens) {
      await queryRunner.query(`
				UPDATE payment_token
				SET address = '${ethers.utils.getAddress(token.address)}'
				WHERE id = '${token.id}'
			`);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
