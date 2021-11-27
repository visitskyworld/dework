import _ from "lodash";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Threepid } from "@dewo/api/models/Threepid";
import { AtLeast } from "@dewo/api/types/general";

@Injectable()
export class ThreepidService {
  // private readonly logger = new Logger("ThreepidService");

  constructor(
    @InjectRepository(Threepid)
    private readonly threepidRepo: Repository<Threepid>
  ) {}

  public create(
    partial: AtLeast<Threepid, "source" | "threepid" | "config">
  ): Promise<Threepid> {
    return this.threepidRepo.save(partial);
  }

  public findOne(
    partial: DeepPartial<Threepid>
  ): Promise<Threepid | undefined> {
    return this.threepidRepo.findOne(_.omit(partial, ["user"]));
  }

  public async findOrCreate(
    partial: AtLeast<Threepid, "source" | "threepid" | "config">
  ): Promise<Threepid> {
    const found = await this.findOne({
      source: partial.source,
      threepid: partial.threepid,
    });

    if (!!found) return found;
    return this.create(partial);
  }
}
