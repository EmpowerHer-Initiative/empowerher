import { useNugsVerifyEmail } from "@/hooks/use-nugs";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface VerifyEmailDialogProps {
  children?: React.ReactElement;
  email: string;
}

export const VerifyEmailDialog = ({
  children,
  email,
}: VerifyEmailDialogProps) => {
  const { isOpen, setIsOpen } = useNugsVerifyEmail();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Email</AlertDialogTitle>
          <AlertDialogDescription>
            We&apos;ve sent you an email to verify your email address. <br />
            <span className="text-primary">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button>Verify Email</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
