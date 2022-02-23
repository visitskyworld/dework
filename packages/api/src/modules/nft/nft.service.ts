import { PaymentMethodType } from "@dewo/api/models/PaymentMethod";
import { Task } from "@dewo/api/models/Task";
import { TaskNFT } from "@dewo/api/models/TaskNFT";
import { ThreepidSource } from "@dewo/api/models/Threepid";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DeepPartial, Repository } from "typeorm";

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
      .innerJoin("task.project", "project")
      .innerJoinAndSelect("task.assignees", "assignee")
      .innerJoin("project.organization", "organization")
      .leftJoin("assignee.threepids", "threepid")
      .leftJoin("assignee.paymentMethods", "paymentMethod")
      .leftJoin("task.nfts", "nft")
      .where("organization.mintTaskNFTs = :mintTaskNFTs", {
        mintTaskNFTs: true,
      })
      .andWhere("assignee.id IS NOT NULL")
      .andWhere(
        new Brackets((qb) =>
          qb
            .where("threepid.source = :source", {
              source: ThreepidSource.metamask,
            })
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where("paymentMethod.deletedAt IS NULL")
                  .andWhere("paymentMethod.type = :type", {
                    type: PaymentMethodType.METAMASK,
                  })
              )
            )
        )
      )
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
