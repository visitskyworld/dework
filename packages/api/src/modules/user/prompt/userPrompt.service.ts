import { AtLeast } from "@dewo/api/types/general";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserPrompt } from "@dewo/api/models/UserPrompt";

@Injectable()
export class UserPromptService {
  constructor(
    @InjectRepository(UserPrompt)
    private readonly repo: Repository<UserPrompt>
  ) {}

  public async create(
    partial: AtLeast<UserPrompt, "userId" | "type">
  ): Promise<UserPrompt> {
    const created = await this.repo.save(partial);
    return this.repo.findOneOrFail(created.id);
  }

  public async update(
    partial: AtLeast<UserPrompt, "userId" | "type">
  ): Promise<UserPrompt> {
    await this.repo.update(
      { userId: partial.userId, type: partial.type },
      partial
    );

    return this.repo.findOneOrFail({
      userId: partial.userId,
      type: partial.type,
    });
  }
}
