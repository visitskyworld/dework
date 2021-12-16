import moment from "moment";
import * as uuid from "uuid";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Storage, Bucket } from "@google-cloud/storage";
import { ConfigType } from "../app/config";
import { CreateFileUploadResponse } from "./dto/CreateFileUploadResponse";

@Injectable()
export class FileUploadService {
  private storage: Storage;
  private bucket: Bucket;

  constructor(configService: ConfigService<ConfigType>) {
    const credentialsJsonBase64 = configService.get(
      "GOOGLE_CLOUD_CREDENTIALS"
    ) as string;
    const credentialsJsonString = Buffer.from(
      credentialsJsonBase64,
      "base64"
    ).toString();
    const bucketName = configService.get(
      "GOOGLE_CLOUD_STORAGE_BUCKET_NAME"
    ) as string;
    this.storage = new Storage({
      credentials: JSON.parse(credentialsJsonString),
    });
    this.bucket = this.storage.bucket(bucketName);
  }

  public async createSignedUrl(
    fileName: string,
    contentType: string
  ): Promise<CreateFileUploadResponse> {
    const filePath = `uploads/${uuid.v4()}/${fileName}`;
    const file = this.bucket.file(filePath);
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: moment().add(15, "minutes").valueOf(),
      contentType,
    });
    return { signedUrl, publicUrl: file.publicUrl() };
  }
}
