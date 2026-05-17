const getPolarClient = () =>
  import("@/services/auth/auth").then((m) => m.polarClient);

export async function getSubscriptionDetails(subscriptionId: string) {
  const polarClient = await getPolarClient();
  return polarClient.subscriptions.get({ id: subscriptionId });
}

export async function cancelSubscription(subscriptionId: string) {
  const polarClient = await getPolarClient();
  return polarClient.subscriptions.revoke({ id: subscriptionId });
}

export async function deleteCustomerByEmail(email: string) {
  const polarClient = await getPolarClient();
  const customers = await polarClient.customers.list({ email });
  const customer = customers.result.items[0];
  if (customer) {
    await polarClient.customers.delete({ id: customer.id });
  }
}
