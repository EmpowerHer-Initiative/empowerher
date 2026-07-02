import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { LogOut, MoreHorizontal } from "lucide-react";
import { UAParser } from "ua-parser-js";

import { useRevokeSession } from "@/services/auth/hooks/use-user";
import { useTRPC } from "@/services/trpc/client";
import { RouterOutputs } from "@/services/trpc/routers/_app";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Laptop, Phone } from "@/components/icons";

export const Devices = () => {
  const { id } = useParams<{ id: string }>();

  const trpc = useTRPC();
  const { data: user } = useQuery(
    trpc.users.get.queryOptions(id, {
      enabled: !!id,
    })
  );
  const { data: sessions } = useQuery(
    trpc.auth.listSessions.queryOptions(id, {
      enabled: !!id,
    })
  );

  if (!user) return null;

  if (sessions?.length === 0) return <div>No devices found</div>;

  return (
    <div>
      <Table>
        <TableBody>
          {sessions?.map((session) => (
            <EachSessions key={session.id} session={session} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

function EachSessions({
  session,
}: {
  session: RouterOutputs["auth"]["listSessions"][number];
}) {
  const parser = new UAParser();
  const result = parser.setUA(session.userAgent ?? "").getResult();

  const [revokeOpen, setRevokeOpen] = useState(false);
  const revokeSession = useRevokeSession();

  return (
    <TableRow key={session.id}>
      <TableCell className="flex items-center gap-3">
        {result.device.type === "mobile" ? <Phone /> : <Laptop />}
        <div>
          <p className="text-sm font-medium">{result.os.name}</p>
          <p className="text-muted-foreground text-xs">
            {result.browser.name} {result.browser.version}
          </p>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {formatDistanceToNow(session.createdAt, { addSuffix: true })}
      </TableCell>
      <TableCell className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setRevokeOpen(true)}
            >
              Revoke
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={revokeOpen} onOpenChange={setRevokeOpen}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <LogOut />
              </AlertDialogMedia>
              <AlertDialogTitle>Revoke session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke this session? The device will be
                signed out.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={revokeSession.isPending}
                onClick={() =>
                  revokeSession.mutate(session.id, {
                    onSuccess: () => setRevokeOpen(false),
                  })
                }
              >
                Revoke
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
