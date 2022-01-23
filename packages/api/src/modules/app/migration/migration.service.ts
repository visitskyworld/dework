import { InjectConnection } from "@nestjs/typeorm";
import { Logger } from "@nestjs/common";
import { Connection, Migration } from "typeorm";

export class MigrationService {
  private readonly logger = new Logger("MigrationService");

  constructor(@InjectConnection() public readonly connection: Connection) {}

  public async migrate(): Promise<void> {
    const migrationNeeded = await this.connection.showMigrations();
    if (migrationNeeded) {
      this.logger.log("Running migrations...");
      const migrations: Migration[] = await this.connection.runMigrations();
      migrations.forEach((migration: Migration) => {
        this.logger.log(migration.name);
      });
    } else {
      this.logger.log("No new migrations found");
    }
    this.logger.log("Migrations complete!");
  }

  public async dropDatabase(): Promise<void> {
    await this.connection.dropDatabase();
    this.logger.log("Database Dropped!");
  }

  public async revert(): Promise<void> {
    await this.connection.undoLastMigration();
    this.logger.log("Reverted last migration");
  }
}
