import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Mail } from "lucide-react";

import { useTRPC } from "@/services/trpc/client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export const SocialAccounts = () => {
  const { id } = useParams<{ id: string }>();

  const trpc = useTRPC();
  const { data: accounts } = useQuery(
    trpc.users.listAccounts.queryOptions(id, {
      enabled: !!id,
    })
  );

  if (!accounts) return null;

  const filteredAccounts = accounts?.filter(
    (account) => account.providerId !== "credential"
  );

  if (filteredAccounts.length === 0) return <div>No social accounts found</div>;

  return (
    <div>
      <Table>
        <TableBody>
          {filteredAccounts.map((account) => (
            <TableRow key={account.id} className="text-muted-foreground">
              <TableCell className="flex items-center gap-2">
                <Mail size={14} />{" "}
                <span className="text-foreground font-medium capitalize">
                  {account.providerId}
                </span>
                {/* <span className="inline-block bg-foreground size-1 rounded-full"></span> */}
              </TableCell>
              <TableCell className="text-right text-xs">
                added {format(account.createdAt, "MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Button onClick={() => linkAccount.mutate({ provider: "google" })}>
        Link account
      </Button> */}
    </div>
  );
};
