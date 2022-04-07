import { MigrationInterface, QueryRunner } from "typeorm";

export class UserOnboardingCompletedAt1649243193174
  implements MigrationInterface
{
  name = "UserOnboardingCompletedAt1649243193174";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_onboarding" ADD "completedAt" TIMESTAMP`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_onboarding" DROP COLUMN "completedAt"`
    );
  }
}
