import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { FileUploadService } from "./fileUpload.service";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CreateFileUploadUrlInput } from "./dto/CreateFileUploadUrlInput";
import { CreateFileUploadResponse } from "./dto/CreateFileUploadResponse";

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
