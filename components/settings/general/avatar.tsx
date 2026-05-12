import React, { useEffect, useMemo, useState } from "react";
import { useCurrentUser, useUpdateUser } from "@/services/auth/hooks/use-user";
import { toast } from "sonner";

import { useUpload } from "@/hooks/use-upload";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const GeneralAvatar = () => {
  const [avatar, setAvatar] = useState<File | null>(null);

  const { data: user } = useCurrentUser();
  const updateUser = useUpdateUser();

  const { upload, isUploading } = useUpload();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>
          <AvatarPreview avatar={avatar} userImage={user?.user.image ?? ""} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="hidden"
          />
        </Label>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          onClick={async () => {
            if (!avatar || !user?.user.id) return;

            const result = await upload(avatar, {
              folder: "users",
              key: user?.user.id,
            });

            updateUser.mutate(
              { image: result?.publicUrl ?? "" },
              {
                onSuccess: () => {
                  toast.success("Avatar updated successfully");
                },
                onError: (error) => {
                  toast.error(error.message);
                },
              }
            );
          }}
          disabled={updateUser.isPending || !avatar || isUploading}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};

const AvatarPreview = React.memo(
  ({ avatar, userImage }: { avatar: File | null; userImage: string }) => {
    const objectUrl = useMemo(
      () => (avatar ? URL.createObjectURL(avatar) : null),
      [avatar]
    );

    useEffect(() => {
      return () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }, [objectUrl]);

    return (
      <Avatar className="size-24">
        <AvatarImage src={objectUrl ?? userImage} />
        <AvatarFallback />
      </Avatar>
    );
  }
);

AvatarPreview.displayName = "AvatarPreview";
