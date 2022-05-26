import { Skill } from "@dewo/api/models/Skill";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SkillStatistic {
  @Field()
  public skill!: Skill;

  @Field(() => Int)
  public count!: number;
}
