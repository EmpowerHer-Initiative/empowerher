"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/services/auth/hooks/use-user";
import {
  CheckIcon,
  CopyIcon,
  FileIcon,
  LayoutDashboardIcon,
  PackageIcon,
  Settings2Icon,
  UploadCloudIcon,
  UsersIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UploadedFile = {
  name: string;
  url: string;
};

const HIDDEN_PATHS = [
  "/login",
  "/signup",
  "/reset-password",
  "/checkout",
  "/success",
];

export const AdminToolbar = () => {
  const { data: session } = useCurrentUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const { upload, isUploading, progress } = useUpload();

  const handleDrop = async (files: File[]) => {
    if (!files.length) return;
    const file = files[0];
    const result = await upload(file, { folder: "media" });
    if (result) {
      setUploads((prev) => [
        { name: file.name, url: result.publicUrl },
        ...prev,
      ]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    disabled: isUploading,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
      "application/pdf": [],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!session || session.user.role !== "admin") return null;
  if (pathname.startsWith("/admin")) return null;
  if (pathname.startsWith("/ui")) return null;
  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <div className="fixed right-4 bottom-4 z-40">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          aria-label="Admin toolbar"
          render={
            <Button
              size={"icon"}
              className={cn(
                "shadow-dialog size-16 rounded-full",
                isOpen && "pointer-events-none scale-95 opacity-50"
              )}
            >
              <WrenchIcon className="size-5" />
            </Button>
          }
        />

        <PopoverContent
          side="top"
          align="end"
          sideOffset={12}
          className="h-96 w-96 gap-0 p-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <p className="text-sm font-semibold">Admin Toolbar</p>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsOpen(false)}
            >
              <XIcon className="size-3.5" />
            </Button>
          </div>

          <Separator />

          <Tabs defaultValue="upload" className="gap-0">
            <div className="px-1.5 pt-1.5">
              <TabsList className="w-full">
                <TabsTrigger
                  value="upload"
                  layoutId="admin-toolbar-tab"
                  className="flex-1 text-xs"
                >
                  Media Upload
                </TabsTrigger>
                <TabsTrigger
                  value="navigate"
                  layoutId="admin-toolbar-tab"
                  className="flex-1 text-xs"
                >
                  Quick Nav
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="upload" className="mt-0 p-4">
              <div className="space-y-3">
                {/* Drop zone */}
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2.5 rounded-xl border-2 border-dashed px-4 py-6 transition-all",
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : isUploading
                        ? "border-border cursor-default opacity-60"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="bg-muted flex size-11 items-center justify-center rounded-full">
                    {isUploading ? (
                      <Spinner className="size-5" />
                    ) : (
                      <UploadCloudIcon className="text-muted-foreground size-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {isUploading ? "Uploading…" : "Drop or click to upload"}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      JPG, PNG, WebP, GIF, PDF · max 10 MB
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {isUploading && progress && (
                  <div className="space-y-1">
                    <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <p className="text-muted-foreground text-right text-xs">
                      {progress.percentage}%
                    </p>
                  </div>
                )}

                {/* Uploaded files */}
                {uploads.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                      Recent
                    </p>
                    <div className="max-h-44 space-y-1 overflow-y-auto">
                      {uploads.map((file, i) => (
                        <div
                          key={i}
                          className="bg-muted/50 flex items-center gap-2 rounded-lg px-2.5 py-2"
                        >
                          <FileIcon className="text-muted-foreground size-3.5 shrink-0" />
                          <span className="min-w-0 flex-1 truncate text-xs">
                            {file.name}
                          </span>
                          <button
                            onClick={() => copyUrl(file.url)}
                            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                            title="Copy URL"
                          >
                            {copiedUrl === file.url ? (
                              <CheckIcon className="text-primary size-3.5" />
                            ) : (
                              <CopyIcon className="size-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="navigate" className="mt-0 p-4">
              <div className="grid grid-cols-2 gap-2">
                <NavItem
                  href="/admin"
                  icon={LayoutDashboardIcon}
                  label="Overview"
                />
                <NavItem href="/admin/users" icon={UsersIcon} label="Users" />
                <NavItem
                  href="/admin/products"
                  icon={PackageIcon}
                  label="Products"
                />
                <NavItem
                  href="/settings"
                  icon={Settings2Icon}
                  label="Settings"
                />
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const NavItem = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => (
  <Link
    href={href}
    className="bg-muted hover:bg-muted/60 flex flex-col items-center gap-2 rounded-xl p-4 transition-colors"
  >
    <div className="bg-background border-border flex size-9 items-center justify-center rounded-xl border">
      <Icon className="size-4" />
    </div>
    <span className="text-xs font-medium">{label}</span>
  </Link>
);
