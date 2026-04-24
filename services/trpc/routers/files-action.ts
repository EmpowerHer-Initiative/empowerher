"use server";

import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/services/trpc/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deleteFile = async (key: string) => {
  let keyUsed = key;

  if (key.startsWith("http")) {
    keyUsed = keyUsed.replace(R2_PUBLIC_URL + "/", "");
  }

  await r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: keyUsed.split("?")[0],
    })
  );
};
