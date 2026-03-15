import { parseAsBoolean, useQueryState } from "nuqs";

export const useNugsVerifyEmail = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "verify-email",
    parseAsBoolean.withDefault(false)
  );

  return { isOpen, setIsOpen };
};
