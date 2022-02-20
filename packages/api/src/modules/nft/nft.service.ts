import { Task } from "@dewo/api/models/Task";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class NFTService {
  constructor(
    @InjectRepository(TaskNFT)
    private readonly taskNftRepo: Repository<TaskNFT>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
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

  public findNextTaskToMint(): Promise<Task | undefined> {
    return this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.project", "project")
      .innerJoinAndSelect("task.assignees", "assignee")
      .innerJoin("project.organization", "organization")
      .leftJoin("task.nfts", "nft")
      .where("organization.mintTaskNFTs = :mintTaskNFTs", {
        mintTaskNFTs: true,
      })
      .andWhere("assignee.id IS NOT NULL")
      .andWhere("nft.id IS NULL")
      .orderBy("task.createdAt", "ASC")
      .getOne();
  }

  public async getNextTokenId(): Promise<number> {
    const result = await this.taskNftRepo
      .createQueryBuilder("nft")
      .select("MAX(nft.tokenId)", "max")
      .getRawOne();
    return result.max ? result.max + 1 : 1;
  }
}
