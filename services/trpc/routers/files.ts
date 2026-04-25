import {
  deleteObject,
  getDownloadUrl,
  getPublicUrl,
  getUploadUrl,
  listFiles,
} from "@/services/storage";
import {
  adminProcedure,
  authenticatedProcedure,
  baseProcedure,
  createTRPCRouter,
} from "@/services/trpc/init";
import { featureGuard } from "@/services/trpc/middleware/feature-guard";
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
      const { signedUrl } = await getDownloadUrl(input.key, SIGNED_URL_EXPIRY);
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
      return listFiles({ prefix: search, cursor, maxKeys: limit });
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

      return getUploadUrl({
        key,
        contentType: input.contentType,
        contentLength: input.size,
        expiresIn: SIGNED_URL_EXPIRY,
      });
    }),

  getPresignedUrl: adminProcedure
    .use(featureGuard("storage"))
    .input(
      z.object({
        fileName: z.string().min(1),
        contentType: z.string().refine((v) => ALLOWED_TYPES.includes(v), {
          message: "File type not allowed",
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { fileName, contentType } = input;
      const key = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      const result = await getUploadUrl({
        key,
        contentType,
        expiresIn: 300,
      });

      return {
        presignedUrl: result.signedUrl,
        key: result.key,
        publicUrl: result.publicUrl,
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
        key = key.replace(getPublicUrl(""), "");
      }

      key = key.split("?")[0];

      return getUploadUrl({
        key,
        contentType: input.contentType,
        contentLength: input.size,
        expiresIn: SIGNED_URL_EXPIRY,
      });
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
      await deleteObject(key);
      return { success: true };
    }),
});
