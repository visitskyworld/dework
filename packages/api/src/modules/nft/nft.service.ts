import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class NFTService {
  constructor(
    @InjectRepository(TaskNFT)
    private readonly taskNftRepo: Repository<TaskNFT>
  ) {}

  public async create(partial: DeepPartial<TaskNFT>): Promise<TaskNFT> {
    const created = await this.taskNftRepo.save(partial);
    return this.findById(created.id) as Promise<TaskNFT>;
  }

  public findById(id: string): Promise<TaskNFT | undefined> {
    return this.taskNftRepo.findOne(id);
  }

  public findByTokenId(tokenId: number): Promise<TaskNFT | undefined> {
    return this.taskNftRepo.findOne({ tokenId });
  }
}
