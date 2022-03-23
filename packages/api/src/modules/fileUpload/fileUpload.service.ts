import moment from "moment";
import * as uuid from "uuid";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Storage, Bucket } from "@google-cloud/storage";
import { ConfigType } from "../app/config";
import { CreateFileUploadResponse } from "./dto/CreateFileUploadResponse";
import request from "request";

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

  // Upload a copy of the image at `fileUrl` to Google Cloud Storage
  public async uploadFileFromUrl(fileUrl: string): Promise<string> {
    const req = request(fileUrl);
    return new Promise((resolve, reject) =>
      req
        .on("response", (response) => {
          const file = this.bucket.file(
            `uploads/${uuid.v4()}/${fileUrl.split("/").pop()}`
          );
          const fileStream = file.createWriteStream({
            contentType: response.headers["content-type"],
          });
          response
            .pipe(fileStream)
            .on("finish", () => resolve(file.publicUrl()))
            .on("error", (err) => reject(err));
        })
        .on("error", (err) => reject(err))
    );
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
