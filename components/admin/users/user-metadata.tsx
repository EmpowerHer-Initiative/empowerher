import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useRemoveMetadataKey,
  useUpdateMetadata,
} from "@/services/auth/hooks/use-admin";
import { useTRPC } from "@/services/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const UserMetadataCard = () => {
  const { id } = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: user } = useQuery(
    trpc.users.get.queryOptions(id, { enabled: !!id })
  );

  const { mutate: updateMetadata, isPending: isAdding } = useUpdateMetadata();
  const { mutate: removeKey, isPending: isRemoving } = useRemoveMetadataKey();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const metadata = (user?.metadata ?? {}) as Record<string, unknown>;
  const entries = Object.entries(metadata);

  const handleAdd = () => {
    if (!newKey.trim()) return;
    updateMetadata(
      {
        userId: id,
        metadata: { [newKey.trim()]: newValue.trim() || true },
      },
      {
        onSuccess: () => {
          setNewKey("");
          setNewValue("");
          setIsAddingNew(false);
        },
      }
    );
  };

  const handleRemove = (key: string) => {
    removeKey({ userId: id, key });
  };

  return (
    <div className="space-y-3">
      {entries.length === 0 && !isAddingNew && (
        <p className="text-muted-foreground text-sm">No metadata entries.</p>
      )}

      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between gap-2 text-sm"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="font-medium">{key}</span>
            <span className="text-muted-foreground truncate">
              {String(value)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => handleRemove(key)}
            disabled={isRemoving}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}

      {isAddingNew ? (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="h-8 flex-1"
          />
          <Input
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="h-8 flex-1"
          />
          <Button
            size="sm"
            variant="outline"
            className="h-8"
            onClick={handleAdd}
            disabled={isAdding || !newKey.trim()}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={() => {
              setIsAddingNew(false);
              setNewKey("");
              setNewValue("");
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingNew(true)}
        >
          <Plus className="mr-1 size-3.5" />
          Add entry
        </Button>
      )}
    </div>
  );
};
