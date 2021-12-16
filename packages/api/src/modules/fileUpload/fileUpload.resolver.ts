import {
  Args,
  Mutation,
  Field,
  InputType,
  ObjectType,
  Resolver,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { FileUploadService } from "./fileUpload.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateFileUploadUrlInput } from "./dto/CreateFileUploadUrlInput";
import { CreateFileUploadResponse } from "./dto/CreateFileUploadResponse";

@InputType()
export class CreateSignedUrlInput {
  @Field()
  public fileName!: string;

  @Field()
  public contentType!: string;
}

@ObjectType()
export class CreateSignedUrlResponse {
  @Field()
  public signedUrl!: string;

  @Field()
  public publicUrl!: string;
}

@Resolver()
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation(() => CreateFileUploadResponse)
  @UseGuards(AuthGuard)
  public async createFileUploadUrl(
    @Args("input") input: CreateFileUploadUrlInput
  ): Promise<CreateFileUploadResponse> {
    return this.fileUploadService.createSignedUrl(
      input.fileName,
      input.contentType
    );
  }
}
