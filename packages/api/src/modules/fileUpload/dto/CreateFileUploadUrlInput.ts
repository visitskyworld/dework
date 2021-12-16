import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateFileUploadUrlInput {
  @Field()
  public fileName!: string;

  @Field()
  public contentType!: string;
}
