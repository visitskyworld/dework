import { Task } from "@dewo/api/models/Task";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TaskSearchResponse {
  @Field(() => [Task])
  tasks!: Task[];

  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int)
  total!: number;
}
