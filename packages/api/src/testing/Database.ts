import { Injectable, Module } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() public readonly connection: Connection) {}
}
@Module({
  imports: [],
  providers: [DatabaseService],
})
export class DatabaseModule {}
