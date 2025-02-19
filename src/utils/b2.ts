import { S3Client } from "@aws-sdk/client-s3";
import { env } from "process";

const s3Client = new S3Client({
  region: env.BACKBLAZE_BUCKET_REGION!,
  endpoint: env.BACKBLAZE_S3_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: env.BACKBLAZE_KEY_ID!,
    secretAccessKey: env.BACKBLAZE_APPLICATION_KEY!,
  },
});

s3Client.middlewareStack.add(
  (next, context) => async (args) => {
    if (args.request.headers && args.request.headers["x-amz-checksum-crc32"]) {
      delete args.request.headers["x-amz-checksum-crc32"];
    }
    return next(args);
  },
  {
    step: "finalizeRequest",
    name: "removeChecksumHeaderMiddleware",
    override: true,
  }
);

export default s3Client;
