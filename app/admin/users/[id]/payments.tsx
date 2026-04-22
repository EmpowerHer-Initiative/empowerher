import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Orders } from "@/components/admin/users/payments/orders";
import { Subscriptions } from "@/components/admin/users/payments/subscriptions";

export const Payments = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Orders />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Subscriptions />
        </CardContent>
      </Card>
    </div>
  );
};
