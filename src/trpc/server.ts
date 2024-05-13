import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { NextRequest } from "next/server";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
// const createContext = cache(() => {
//   const heads = new Headers(headers());
//   heads.set("x-trpc-source", "rsc");
//   heads.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   heads.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin");
//   heads.set("Access-Control-Allow-Credentials", "true");

//   return createTRPCContext({
//     resHeaders: heads
//   });
// });

// export const api = createCaller(createContext);
