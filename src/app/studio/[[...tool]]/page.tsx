/**
 * The embedded Sanity Studio, served at /studio.
 * `sanity.config.ts` carries a "use client" directive, so `config` arrives here
 * as a client reference that <NextStudio> can use without serialization.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
