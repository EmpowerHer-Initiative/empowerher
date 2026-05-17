"use client";

// ^-- to make sure we can mount the Provider from a server component
import { useEffect, useState } from "react";
import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

// import superjson from 'superjson';

import type { AppRouter } from "./routers/_app";

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (data: unknown) => {
        // If the data has an error, throw an error
        if (
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof data.error === "string"
        ) {
          throw new Error(data.error);
        }
      },
    }),
  });
};

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
export let queryClient: QueryClient;

const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) {
    const client = makeQueryClient();
    browserQueryClient = client;
    queryClient = client;
  }
  return browserQueryClient;
};
const getUrl = () => {
  // On client (browser/WebView): use current origin so API works when page is
  // loaded from device IP (e.g. http://192.168.x.x:3000) instead of localhost
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/trpc`;
  }
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  return `${base}/api/trpc`;
};
// Export raw tRPC client for direct client-side calls (not through React Query)
export let trpcClient:
  | ReturnType<typeof createTRPCClient<AppRouter>>
  | undefined;

export const TRPCReactProvider = (
  props: Readonly<{
    children: React.ReactNode;
  }>
) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();
  const [client] = useState(() => {
    const client = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
          // Include credentials (cookies) in cross-origin requests
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include", // Important: sends cookies with requests
            });
          },
        }),
      ],
    });
    // Store the raw client for direct calls
    if (typeof window !== "undefined") {
      trpcClient = client;
    }
    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={client} queryClient={queryClient}>
        <StoredTRPC>
          {props.children}
          <ReactQueryDevtools />
        </StoredTRPC>
      </TRPCProvider>
    </QueryClientProvider>
  );
};

// Store the TRPC instance so it can be accessed without calling the hook
// This is useful for queryOptions() and mutationOptions() which aren't hooks
export let storedTRPC: ReturnType<typeof useTRPC> | undefined;

/**
 * Internal component that stores the TRPC instance
 * Automatically initializes storedTRPC when TRPCReactProvider mounts
 */
const StoredTRPC = ({ children }: { children: React.ReactNode }) => {
  const trpc = useTRPC();

  useEffect(() => {
    if (typeof window !== "undefined") {
      storedTRPC = trpc;
    }
  }, [trpc]);

  return <>{children}</>;
};
