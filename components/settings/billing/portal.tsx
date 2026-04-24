import { useGeneratePortalLink } from "@/services/auth/hooks/use-payments";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BillingPortal = () => {
  const generatePortalLink = useGeneratePortalLink();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portal</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() =>
            generatePortalLink.mutate(
              { returnUrl: "/settings" },
              {
                onError: (error) => {
                  toast.error(error.message || "Failed to open billing portal");
                },
              }
            )
          }
          size={"lg"}
          disabled={generatePortalLink.isPending}
        >
          {generatePortalLink.isPending ? "Loading..." : "Manage Billing"}
        </Button>
      </CardContent>
    </Card>
  );
};
