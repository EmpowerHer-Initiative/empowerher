// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { notSupported } from "@/services/not-supported";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import type {
  ListFilesInput,
  ListFilesOutput,
  SignedUrlInput,
  SignedUrlOutput,
} from "./types";

const DEFAULT_EXPIRY = 60 * 5; // 5 minutes

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const R2_BUCKET = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export function getPublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

function normalizeKey(key: string): string {
  let normalized = key;
  if (normalized.startsWith("http")) {
    normalized = normalized.replace(R2_PUBLIC_URL + "/", "");
  }
  return normalized.split("?")[0];
}

export async function getDownloadUrl(
  key: string,
  expiresIn = DEFAULT_EXPIRY
): Promise<SignedUrlOutput> {
  const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
  const signedUrl = await getSignedUrl(r2, command, { expiresIn });
  return { signedUrl, key, publicUrl: getPublicUrl(key) };
}

export async function getUploadUrl(
  input: SignedUrlInput
): Promise<SignedUrlOutput> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: input.key,
    ContentType: input.contentType,
    ContentLength: input.contentLength,
  });

  const signedUrl = await getSignedUrl(r2, command, {
    expiresIn: input.expiresIn ?? DEFAULT_EXPIRY,
  });

  return { signedUrl, key: input.key, publicUrl: getPublicUrl(input.key) };
}

export async function deleteObject(key: string): Promise<void> {
  const normalized = normalizeKey(key);
  await r2.send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: normalized })
  );
}

export async function listFiles(
  input: ListFilesInput
): Promise<ListFilesOutput> {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    MaxKeys: input.maxKeys,
    ContinuationToken: input.cursor,
    Prefix: input.prefix,
  });

  const response = await r2.send(command);

  const files = (response.Contents ?? [])
    .filter((obj) => !obj.Key!.endsWith("/"))
    .map((obj) => ({
      key: obj.Key!,
      size: obj.Size ?? 0,
      lastModified: obj.LastModified?.toISOString() ?? null,
      publicUrl: getPublicUrl(obj.Key!),
    }));

  return {
    files,
    nextCursor: response.NextContinuationToken ?? null,
  };
}
