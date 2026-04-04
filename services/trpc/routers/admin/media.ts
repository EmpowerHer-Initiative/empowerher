import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/services/trpc/lib/r2";
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const adminMediaRouter = createTRPCRouter({
  getPresignedUrl: adminProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        contentType: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { fileName, contentType } = input;
      const key = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      try {
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
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to generate URL",
        });
      }
    }),

  listFiles: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ input }) => {
      const { search, cursor, limit = 15 } = input;

      try {
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
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to list files",
        });
      }
    }),

  deleteFile: adminProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: key }) => {
      try {
        await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to delete file",
        });
      }
    }),
});
