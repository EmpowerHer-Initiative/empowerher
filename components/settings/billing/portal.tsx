import { useGeneratePortalLink } from "@/services/auth/hooks/use-payments";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BillingPortal = () => {
  const generatePortalLink = useGeneratePortalLink();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => generatePortalLink.mutate()}
          size={"lg"}
          disabled={generatePortalLink.isPending}
        >
          {generatePortalLink.isPending ? "Loading..." : "Manage Billing"}
        </Button>
        {generatePortalLink.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to open billing portal.{" "}
              {generatePortalLink.error?.message && (
                <span className="text-muted-foreground text-xs">
                  {generatePortalLink.error.message}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
