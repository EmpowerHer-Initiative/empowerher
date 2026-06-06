import { polarClient } from "@/services/auth/auth";

export async function getSubscriptionDetails(subscriptionId: string) {
  return polarClient.subscriptions.get({ id: subscriptionId });
}

export async function cancelSubscription(subscriptionId: string) {
  return polarClient.subscriptions.revoke({ id: subscriptionId });
}

export async function deleteCustomerByEmail(email: string) {
  const customers = await polarClient.customers.list({ email });
  const customer = customers.result.items[0];
  if (customer) {
    await polarClient.customers.delete({ id: customer.id });
  }
}
