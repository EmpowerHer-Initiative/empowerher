import {
  adminProcedure,
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/services/trpc/lib/r2";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import z from "zod";

import { deleteFile } from "./files-action";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SIGNED_URL_EXPIRY = 60 * 5; // 5 minutes

export const ALLOWED_FOLDERS = ["users", "media"] as const;

export const filesRouter = createTRPCRouter({
  getDownloadUrl: baseProcedure
    .use(featureGuard("storage"))
    .input(z.object({ key: z.string().min(1) }))
    .query(async ({ input }) => {
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: input.key,
      });

      const signedUrl = await getSignedUrl(r2, command, {
        expiresIn: SIGNED_URL_EXPIRY,
      });

      return { signedUrl };
    }),

  list: adminProcedure
    .use(featureGuard("storage"))
    .input(
      z.object({
        search: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ input }) => {
      const { search, cursor, limit = 15 } = input;

      const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        MaxKeys: limit,
        ContinuationToken: cursor,
        Prefix: search ?? undefined,
      });

      const response = await r2.send(command);

      const files = (response.Contents ?? [])
        .filter((obj) => !obj.Key!.endsWith("/"))
        .map((obj) => ({
          key: obj.Key!,
          size: obj.Size ?? 0,
          lastModified: obj.LastModified?.toISOString() ?? null,
          publicUrl: `${R2_PUBLIC_URL}/${obj.Key}`,
        }));

      return {
        files,
        nextCursor: response.NextContinuationToken ?? null,
      };
    }),

  getUploadUrl: authenticatedProcedure
    .use(featureGuard("storage"))
    .input(
      z.object({
        key: z.string().min(1),
        folder: z.enum(ALLOWED_FOLDERS).optional(),
        contentType: z.string().refine((v) => ALLOWED_TYPES.includes(v), {
          message: "File type not allowed",
        }),
        size: z.number().max(MAX_FILE_SIZE, "File too large"),
      })
    )
    .mutation(async ({ input }) => {
      const key = input.folder ? `${input.folder}/${input.key}` : input.key;

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        ContentType: input.contentType,
        ContentLength: input.size,
      });

      const signedUrl = await getSignedUrl(r2, command, {
        expiresIn: SIGNED_URL_EXPIRY,
      });

      return {
        signedUrl,
        key,
        publicUrl: `${R2_PUBLIC_URL}/${key}`,
      };
    }),

  getPresignedUrl: adminProcedure
    .use(featureGuard("storage"))
    .input(
      z.object({
        fileName: z.string().min(1),
        contentType: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { fileName, contentType } = input;
      const key = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        ContentType: contentType,
      });

      const presignedUrl = await getSignedUrl(r2, command, {
        expiresIn: 300,
      });

      return {
        presignedUrl,
        key,
        publicUrl: `${R2_PUBLIC_URL}/${key}`,
      };
    }),

  update: authenticatedProcedure
    .use(featureGuard("storage"))
    .input(
      z.object({
        oldKey: z.string().min(1),
        contentType: z.string().refine((v) => ALLOWED_TYPES.includes(v), {
          message: "File type not allowed",
        }),
        size: z.number().max(MAX_FILE_SIZE, "File too large"),
      })
    )
    .mutation(async ({ input }) => {
      let key = input.oldKey;

      if (key.startsWith("http")) {
        key = key.replace(R2_PUBLIC_URL + "/", "");
      }

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key.split("?")[0],
        ContentType: input.contentType,
        ContentLength: input.size,
      });

      const signedUrl = await getSignedUrl(r2, command, {
        expiresIn: SIGNED_URL_EXPIRY,
      });

      return {
        signedUrl,
        key,
        publicUrl: `${R2_PUBLIC_URL}/${key}`,
      };
    }),

  delete: authenticatedProcedure
    .use(featureGuard("storage"))
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ input }) => {
      await deleteFile(input.key);
      return { success: true };
    }),

  adminDelete: adminProcedure
    .use(featureGuard("storage"))
    .input(z.string().min(1))
    .mutation(async ({ input: key }) => {
      await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      return { success: true };
    }),
});
