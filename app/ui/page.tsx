"use client";

import { useState } from "react";
import {
  AlertCircleIcon,
  BellIcon,
  CheckCircleIcon,
  CopyIcon,
  CreditCardIcon,
  InfoIcon,
  LogOutIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function UIPage() {
  return (
    <div className="container mx-auto space-y-16 py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">UI Components</h1>
        <p className="text-muted-foreground mt-2">
          All available components with their variants and sizes.
        </p>
      </div>

      <Separator />

      <ButtonSection />
      <Separator />
      <BadgeSection />
      <Separator />
      <AlertSection />
      <Separator />
      <AvatarSection />
      <Separator />
      <CardSection />
      <Separator />
      <InputSection />
      <Separator />
      <SelectSection />
      <Separator />
      <CheckboxSection />
      <Separator />
      <SkeletonSection />
      <Separator />
      <SpinnerSection />
      <Separator />
      <DialogSection />
      <Separator />
      <AlertDialogSection />
      <Separator />
      <DropdownMenuSection />
      <Separator />
      <FieldSection />
      <Separator />
      <InputGroupSection />
      <Separator />
      <InputOTPSection />
      <Separator />
      <ToastSection />
      <Separator />
      <TableSection />
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-6">
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
  </section>
);

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
      {label}
    </p>
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

// ─── Sections ─────────────────────────────────────────────────────────────────

const ButtonSection = () => (
  <Section title="Button">
    <Row label="Variants">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </Row>

    <Row label="Sizes">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </Row>

    <Row label="Icon sizes">
      <Button size="icon-xs" variant="outline">
        <PlusIcon />
      </Button>
      <Button size="icon-sm" variant="outline">
        <PlusIcon />
      </Button>
      <Button size="icon" variant="outline">
        <PlusIcon />
      </Button>
      <Button size="icon-lg" variant="outline">
        <PlusIcon />
      </Button>
    </Row>

    <Row label="With icon">
      <Button>
        <MailIcon /> Send email
      </Button>
      <Button variant="outline">
        <Settings2Icon /> Settings
      </Button>
      <Button variant="destructive">
        <Trash2Icon /> Delete
      </Button>
    </Row>

    <Row label="States">
      <Button disabled>Disabled</Button>
      <Button>
        <Spinner /> Loading
      </Button>
    </Row>
  </Section>
);

const BadgeSection = () => (
  <Section title="Badge">
    <Row label="Variants">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </Row>

    <Row label="With icon">
      <Badge variant="default">
        <CheckCircleIcon /> Published
      </Badge>
      <Badge variant="destructive">
        <AlertCircleIcon /> Error
      </Badge>
      <Badge variant="outline">
        <InfoIcon /> Draft
      </Badge>
    </Row>
  </Section>
);

const AlertSection = () => (
  <Section title="Alert">
    <Row label="Default">
      <div className="w-full max-w-lg space-y-3">
        <Alert>
          <InfoIcon />
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>
            You can add components using the CLI or copy the source directly.
          </AlertDescription>
        </Alert>

        <Alert>
          <BellIcon />
          <AlertTitle>Reminder</AlertTitle>
          <AlertDescription>
            Your subscription renews in 3 days.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              Dismiss
            </Button>
          </AlertAction>
        </Alert>
      </div>
    </Row>

    <Row label="Destructive">
      <div className="w-full max-w-lg space-y-3">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            Your session has expired. Please sign in again.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive">
          <Trash2Icon />
          <AlertTitle>This action is irreversible</AlertTitle>
          <AlertDescription>
            Deleting this record will permanently remove all associated data.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </AlertAction>
        </Alert>
      </div>
    </Row>
  </Section>
);

const AvatarSection = () => (
  <Section title="Avatar">
    <Row label="Sizes">
      <Avatar size="sm">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
    </Row>

    <Row label="Fallback">
      <Avatar size="sm">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>
    </Row>

    <Row label="Group">
      <AvatarGroup>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </Row>
  </Section>
);

const CardSection = () => (
  <Section title="Card">
    <Row label="Default">
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Supporting description text.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Card body content goes here. Add anything you need.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm" className="ml-auto">
            Action
          </Button>
        </CardFooter>
      </Card>

      <Card size="sm" className="w-64">
        <CardHeader>
          <CardTitle>Small card</CardTitle>
          <CardDescription>Compact variant.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Tighter spacing.</p>
        </CardContent>
      </Card>
    </Row>
  </Section>
);

const InputSection = () => (
  <Section title="Input">
    <Row label="Sizes">
      <div className="w-64 space-y-2">
        <Label>Default</Label>
        <Input placeholder="Email address" />
      </div>
      <div className="w-64 space-y-2">
        <Label>Large</Label>
        <Input size="lg" placeholder="Email address" />
      </div>
    </Row>

    <Row label="Types">
      <div className="w-64 space-y-2">
        <Label>Password</Label>
        <Input type="password" placeholder="Password" />
      </div>
      <div className="w-64 space-y-2">
        <Label>Search</Label>
        <Input type="search" placeholder="Search..." />
      </div>
    </Row>

    <Row label="States">
      <div className="w-64 space-y-2">
        <Label>Disabled</Label>
        <Input placeholder="Disabled" disabled />
      </div>
      <div className="w-64 space-y-2">
        <Label>Invalid</Label>
        <Input placeholder="Invalid input" aria-invalid />
      </div>
    </Row>

    <Row label="Textarea">
      <div className="w-80 space-y-2">
        <Label>Default</Label>
        <Textarea placeholder="Write something..." />
      </div>
      <div className="w-80 space-y-2">
        <Label>Disabled</Label>
        <Textarea placeholder="Disabled" disabled />
      </div>
    </Row>
  </Section>
);

const SelectSection = () => (
  <Section title="Select">
    <Row label="Sizes">
      <div className="space-y-2">
        <Label>Default</Label>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Small</Label>
        <Select>
          <SelectTrigger size="sm" className="w-48">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Row>
  </Section>
);

const CheckboxSection = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Section title="Checkbox">
      <Row label="States">
        <div className="flex items-center gap-2">
          <Checkbox id="unchecked" />
          <Label htmlFor="unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="checked"
            checked={checked}
            onCheckedChange={(v) => setChecked(!!v)}
          />
          <Label htmlFor="checked">Controlled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="disabled" disabled />
          <Label htmlFor="disabled">Disabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="disabled-checked" checked disabled />
          <Label htmlFor="disabled-checked">Disabled checked</Label>
        </div>
      </Row>
    </Section>
  );
};

const SkeletonSection = () => (
  <Section title="Skeleton">
    <Row label="Shapes">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="size-10 rounded-full" />
    </Row>

    <Row label="Card skeleton">
      <div className="w-64 space-y-3">
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Row>
  </Section>
);

const SpinnerSection = () => (
  <Section title="Spinner">
    <Row label="Sizes">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-5" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
    </Row>

    <Row label="Inside button">
      <Button disabled>
        <Spinner /> Saving…
      </Button>
      <Button variant="outline" disabled>
        <Spinner /> Loading
      </Button>
    </Row>
  </Section>
);

const DialogSection = () => (
  <Section title="Dialog">
    <Row label="Default">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update your display name and email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="Ali Samadi" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="ali@example.com" />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <Button>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Row>

    <Row label="No close button">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          No close button
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>
              You must use one of the footer buttons to dismiss this dialog.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Row>
  </Section>
);

const AlertDialogSection = () => (
  <Section title="Alert Dialog">
    <Row label="Default (large)">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          Open alert dialog
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Row>

    <Row label="Small with icon">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          <Trash2Icon /> Delete item
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete item</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the item. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Row>

    <Row label="With user icon">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          <UserIcon /> Remove user
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <UserIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Remove user</AlertDialogTitle>
            <AlertDialogDescription>
              This user will lose access to all resources in this workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Row>
  </Section>
);

const DropdownMenuSection = () => {
  const [showStatus, setShowStatus] = useState(true);
  const [radio, setRadio] = useState("ali");

  return (
    <Section title="Dropdown Menu">
      <Row label="Basic items">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Open menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon /> Profile
                <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon /> Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings2Icon /> Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon /> Sign out
              <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>

      <Row label="Checkbox & radio items">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Options
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Preferences</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showStatus}
              onCheckedChange={setShowStatus}
            >
              Show status bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Team member</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={radio} onValueChange={setRadio}>
              <DropdownMenuRadioItem value="ali">Ali</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="sara">Sara</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>

      <Row label="With submenu">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            With submenu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <CopyIcon /> Copy
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserIcon /> Share
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <MailIcon /> Email
                </DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2Icon /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
    </Section>
  );
};

const FieldSection = () => (
  <Section title="Field">
    <Row label="Vertical (default)">
      <FieldGroup className="max-w-sm">
        <Field>
          <FieldLabel>Email address</FieldLabel>
          <Input placeholder="you@example.com" />
          <FieldDescription>We'll never share your email.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input type="password" placeholder="••••••••" />
        </Field>
      </FieldGroup>
    </Row>

    <Row label="With error">
      <FieldGroup className="max-w-sm">
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input placeholder="ali" aria-invalid />
          <FieldError>Username is already taken.</FieldError>
        </Field>
      </FieldGroup>
    </Row>

    <Row label="Horizontal">
      <FieldGroup className="max-w-sm">
        <Field orientation="horizontal">
          <FieldTitle>Notifications</FieldTitle>
          <Checkbox />
        </Field>
        <Field orientation="horizontal">
          <FieldTitle>Marketing emails</FieldTitle>
          <Checkbox />
        </Field>
      </FieldGroup>
    </Row>

    <Row label="FieldSet">
      <FieldSet className="max-w-sm">
        <Field>
          <FieldLabel>First name</FieldLabel>
          <Input placeholder="Ali" />
        </Field>
        <Field>
          <FieldLabel>Last name</FieldLabel>
          <Input placeholder="Samadi" />
        </Field>
      </FieldSet>
    </Row>
  </Section>
);

const InputGroupSection = () => (
  <Section title="Input Group">
    <Row label="Inline addons">
      <div className="w-64 space-y-3">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
        </InputGroup>

        <InputGroup>
          <InputGroupInput placeholder="Amount" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
      </div>
    </Row>

    <Row label="With button">
      <div className="w-72 space-y-3">
        <InputGroup>
          <InputGroupInput placeholder="Search…" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton>
              <SearchIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupAddon align="inline-start">
            <MailIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="you@example.com" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="ghost" size="icon-xs">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Row>

    <Row label="Textarea">
      <div className="w-80">
        <InputGroup>
          <InputGroupTextarea placeholder="Write a message…" />
          <InputGroupAddon align="block-end" className="justify-end border-t">
            <InputGroupButton size="xs">Send</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Row>
  </Section>
);

const InputOTPSection = () => (
  <Section title="Input OTP">
    <Row label="6-digit">
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
    </Row>

    <Row label="4-digit">
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </Row>

    <Row label="Disabled">
      <InputOTP maxLength={6} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Row>
  </Section>
);

const ToastSection = () => (
  <Section title="Toast (Sonner)">
    <Row label="Variants">
      <Button variant="outline" onClick={() => toast.success("Changes saved.")}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Something went wrong.")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Your session expires soon.")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("A new version is available.")}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.loading("Uploading file…", { duration: 2000 })}
      >
        Loading
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event created", {
            description: "Monday, January 3rd at 6:00pm",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        With action
      </Button>
    </Row>
  </Section>
);

const TableSection = () => (
  <Section title="Table">
    <Row label="Default">
      <div className="w-full max-w-2xl">
        <Table>
          <TableCaption>Recent transactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                name: "Ali Samadi",
                email: "ali@example.com",
                role: "Admin",
                amount: "$250.00",
              },
              {
                name: "Sara Jones",
                email: "sara@example.com",
                role: "Editor",
                amount: "$150.00",
              },
              {
                name: "Tom Lee",
                email: "tom@example.com",
                role: "Viewer",
                amount: "$0.00",
              },
            ].map((row) => (
              <TableRow key={row.email}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell className="text-right">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$400.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Row>
  </Section>
);
