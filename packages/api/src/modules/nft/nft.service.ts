import { Task } from "@dewo/api/models/Task";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { ThreepidSource } from "@dewo/api/models/Threepid";
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

  public findByTokenId(
    tokenId: number,
    contractId: string
  ): Promise<TaskNFT | undefined> {
    return this.taskNftRepo.findOne({ tokenId, contractId });
  }

  public findNextTaskToMint(): Promise<Task | undefined> {
    return this.taskRepo
      .createQueryBuilder("task")
      .innerJoinAndSelect("task.owners", "owner")
      .andWhere("owner.username NOT LIKE '%deworker%'")
      .andWhere("assignee.username NOT LIKE '%deworker%'")
      .andWhere("task.name NOT LIKE '%test%'")
      .andWhere("task.name NOT LIKE '%demo%'")
      .andWhere("project.name NOT LIKE '%test%'")
      .andWhere("project.name NOT LIKE '%demo%'")
      .innerJoin("task.project", "project")
      .innerJoinAndSelect("task.assignees", "assignee")
      .innerJoin("project.organization", "organization")
      .leftJoin("assignee.threepids", "threepid")
      .leftJoin("task.nfts", "nft")
      .where("organization.mintTaskNFTs = :mintTaskNFTs", {
        mintTaskNFTs: true,
      })
      .andWhere("assignee.id IS NOT NULL")
      .andWhere("threepid.source = :source", {
        source: ThreepidSource.metamask,
      })
      .andWhere("nft.id IS NULL")
      .andWhere("task.doneAt > '2022-02-21 21:00:00'")
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
