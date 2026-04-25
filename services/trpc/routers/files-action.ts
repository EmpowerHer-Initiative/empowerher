"use server";

import { deleteObject } from "@/services/storage";

export const deleteFile = async (key: string) => {
  await deleteObject(key);
};
