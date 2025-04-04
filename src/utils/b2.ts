import { S3Client } from "@aws-sdk/client-s3";
import { FinalizeRequestMiddleware, FinalizeRequestHandlerOptions } from "@aws-sdk/types";
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

const removeChecksumHeaderMiddleware: FinalizeRequestMiddleware<any, any> = (next, context) => async (args) => {
  if ("request" in args && args.request && typeof args.request === "object" && "headers" in args.request) {
    const request = args.request as { headers: Record<string, string> };
    if (request.headers["x-amz-checksum-crc32"]) {
      delete request.headers["x-amz-checksum-crc32"];
    }
  }
  return next(args);
};

s3Client.middlewareStack.add(removeChecksumHeaderMiddleware, {
  step: "finalizeRequest",
  name: "removeChecksumHeaderMiddleware",
  override: true,
});

export default s3Client;
