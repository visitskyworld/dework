import { MigrationInterface, QueryRunner } from "typeorm";

export class AuditLogEvent1649542796612 implements MigrationInterface {
  name = "AuditLogEvent1649542796612";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "audit_log_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entity" character varying NOT NULL, "entityId" uuid NOT NULL, "userId" uuid, "sessionId" uuid, "diff" json NOT NULL, CONSTRAINT "PK_c37ba8970192420a944eaef393d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40564054684d0b8c53c3e41bea" ON "audit_log_event" ("entity") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bad7c63c4a17393abeffd9055c" ON "audit_log_event" ("entityId") `
    );
    await queryRunner.query(
      `ALTER TABLE "audit_log_event" ADD CONSTRAINT "FK_53f1e79c9b5be18aa102c4f3a64" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audit_log_event" DROP CONSTRAINT "FK_53f1e79c9b5be18aa102c4f3a64"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bad7c63c4a17393abeffd9055c"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_40564054684d0b8c53c3e41bea"`
    );
    await queryRunner.query(`DROP TABLE "audit_log_event"`);
  }
}
