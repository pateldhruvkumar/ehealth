import { S3Client, DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_SECRET_ACCESS_KEY
} from "./env";

const hasStaticCreds = Boolean(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY);

export const s3 = new S3Client({
  region: AWS_REGION,
  credentials: hasStaticCreds
    ? {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!
      }
    : undefined
});

export async function generateUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType
  });

  return getSignedUrl(s3, command, { expiresIn: 15 * 60 });
}

export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key
  });

  return getSignedUrl(s3, command, { expiresIn: 60 * 60 });
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key
  });

  await s3.send(command);
}

