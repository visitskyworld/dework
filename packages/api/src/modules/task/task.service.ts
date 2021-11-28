import { Task } from "@dewo/api/models/Task";
import { DeepAtLeast } from "@dewo/api/types/general";
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

  public async update(partial: DeepAtLeast<Task, "id">): Promise<Task> {
    const updated = await this.taskRepo.save(partial);
    return this.taskRepo.findOne(updated.id) as Promise<Task>;
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.taskRepo.findOne(id);
  }
}
