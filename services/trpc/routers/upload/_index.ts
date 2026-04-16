import { baseProcedure, createTRPCRouter } from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { r2, R2_BUCKET, R2_PUBLIC_URL } from "../../lib/r2";
import { deleteFile } from "./action";

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

export const uploadRouter = createTRPCRouter({
  getUploadUrl: baseProcedure
    .use(featureGuard("upload"))
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
      try {
        const key = input.folder ? `${input.folder}/${input.key}` : input.key;

        const command = new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          ContentType: input.contentType,
          ContentLength: input.size,
        });

        let signedUrl: string;

        try {
          signedUrl = await getSignedUrl(r2, command, {
            expiresIn: SIGNED_URL_EXPIRY,
          });
        } catch (err) {
          console.error("Failed to generate signed URL:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate upload URL",
          });
        }

        return {
          signedUrl,
          key,
          publicUrl: `${R2_PUBLIC_URL}/${key}`,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        console.error("Unexpected error in getUploadUrl:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while preparing upload",
        });
      }
    }),

  getDownloadUrl: baseProcedure
    .use(featureGuard("upload"))
    .input(
      z.object({
        key: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      try {
        const command = new GetObjectCommand({
          Bucket: R2_BUCKET,
          Key: input.key,
        });

        let signedUrl: string;

        try {
          signedUrl = await getSignedUrl(r2, command, {
            expiresIn: SIGNED_URL_EXPIRY,
          });
        } catch (err) {
          console.error("Failed to generate download URL:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate download URL",
          });
        }

        return { signedUrl };
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        console.error("Unexpected error in getDownloadUrl:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while preparing download",
        });
      }
    }),

  delete: baseProcedure
    .use(featureGuard("upload"))
    .input(
      z.object({
        key: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      await deleteFile(input.key);
      return { success: true };
    }),

  update: baseProcedure
    .use(featureGuard("upload"))
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
      try {
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

        let signedUrl: string;

        try {
          signedUrl = await getSignedUrl(r2, command, {
            expiresIn: SIGNED_URL_EXPIRY,
          });
        } catch (err) {
          console.error("Failed to generate signed URL for update:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate upload URL for replacement file",
          });
        }

        return {
          signedUrl,
          key,
          publicUrl: `${R2_PUBLIC_URL}/${key}`,
        };
      } catch (err) {
        if (err instanceof TRPCError) throw err;

        console.error("Unexpected error in update:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while updating file",
        });
      }
    }),
});
