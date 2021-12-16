import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CreateFileUploadResponse {
  @Field()
  public signedUrl!: string;

  @Field()
  public publicUrl!: string;
}
