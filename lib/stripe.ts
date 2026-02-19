import Stripe from "stripe";
import { requireEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      typescript: true,
    });
  }
  return stripeClient;
}

export async function hasActiveSubscription(email: string): Promise<boolean> {
  const stripe = getStripeClient();
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  const customer = customers.data[0];
  if (!customer || typeof customer === "string") {
    return false;
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    status: "all",
    limit: 20,
  });

  return subscriptions.data.some((sub) => sub.status === "active" || sub.status === "trialing");
}
