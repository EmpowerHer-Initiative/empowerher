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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface VerifyEmailDialogProps {
  children?: React.ReactElement;
  email: string;
}

export const VerifyEmailDialog = ({
  children,
  email,
}: VerifyEmailDialogProps) => {
  const {
    isOpen,
    setIsOpen,
    email: emailParams,
    setEmail: setEmailParams,
  } = useNugsVerifyEmail();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setEmailParams(null);
      }}
    >
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Email</AlertDialogTitle>
          <AlertDialogDescription>
            We&apos;ve sent you an email to verify your email address. <br />
            <span className="text-primary">{email || emailParams}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 flex justify-center">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button>Resend Code</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
