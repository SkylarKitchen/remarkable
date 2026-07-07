import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // `false` if you want to ensure fresh data; `defineLive` handles caching.
  useCdn: true,
  // Stega encoding powers the click-to-edit overlays in Presentation.
  stega: {
    studioUrl,
  },
});
