import { useGeneratePortalLink } from "@/services/auth/hooks/use-payments";

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
        <Button onClick={() => generatePortalLink.mutate()} size={"lg"}>
          Manage Billing
        </Button>
      </CardContent>
    </Card>
  );
};
