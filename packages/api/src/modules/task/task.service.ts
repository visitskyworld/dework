import { Task } from "@dewo/api/models/Task";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";

@Injectable()
export class TaskService {
  // private readonly logger = new Logger("UserService");

  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}

  public async create(partial: DeepPartial<Task>): Promise<Task> {
    const created = await this.taskRepo.save(partial);
    return this.taskRepo.findOne(created.id) as Promise<Task>;
  }
}
