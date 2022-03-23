import { Module } from "@nestjs/common";
import { FileUploadResolver } from "./fileUpload.resolver";
import { FileUploadService } from "./fileUpload.service";

@Module({
  providers: [FileUploadResolver, FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
