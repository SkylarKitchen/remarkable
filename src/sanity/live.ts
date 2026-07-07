import { defineLive } from "next-sanity/live";

import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

// `defineLive` wires up live content updates + draft-mode previews.
// `strict: true` forces every fetch to declare its perspective + stega, so
// published pages can never accidentally leak draft content. The `loadQuery`
// wrapper (./fetch) supplies those based on Next's draft mode.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
});
