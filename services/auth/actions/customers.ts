import { db } from "@/services/db/index";
import { user } from "@/services/db/schema";
import { eq } from "drizzle-orm";

import { deleteFile } from "../../trpc/routers/files-action";

export const removeCustomer = async (email: string) => {
  if (!email) throw new Error("Customer email is required");

  const deletedUser = await db
    .delete(user)
    .where(eq(user.email, email))
    .returning()
    .then((res) => res[0]);
  if (!deletedUser) throw new Error("Failed to delete user");

  if (deletedUser.image) {
    await deleteFile(deletedUser.image);
  }

  return deletedUser;
};
