import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Clerk "convex" JWT template issuer domain.
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
