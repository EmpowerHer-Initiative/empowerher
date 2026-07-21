import { useCurrentUser } from "./use-user";

const useIsAdmin = () => {
  const { data, isPending } = useCurrentUser();
  return { isAdmin: data?.user.role === "admin", isPending };
};

const useIsStaff = () => {
  const { data, isPending } = useCurrentUser();
  const role = data?.user.role;
  return { isStaff: role === "admin" || role === "staff", isPending };
};

export { useIsAdmin, useIsStaff };
