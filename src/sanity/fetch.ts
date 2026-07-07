import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";

import { sanityFetch } from "./live";

/**
 * Fetches content for a page request. In draft mode it pulls drafts (so the
 * Presentation preview shows unpublished edits); otherwise it serves published
 * content. Stega is left off in both cases — click-to-edit runs off the explicit
 * `data-sanity` attributes stamped by `editable()`, and stega text would draw a
 * redundant overlay box around every heading / paragraph / label. Returns `null`
 * if the query fails (e.g. before the Sanity project is configured) so pages can
 * render a graceful fallback.
 */
export async function loadQuery<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  let isEnabled = false;
  try {
    isEnabled = (await draftMode()).isEnabled;
  } catch {
    isEnabled = false;
  }

  try {
    const { data } = await sanityFetch({
      query,
      params,
      perspective: isEnabled ? "drafts" : "published",
      stega: false,
    });
    return (data ?? null) as T | null;
  } catch (error) {
    console.error("[loadQuery] Sanity fetch failed:", error);
    return null;
  }
}

/**
 * A published-only, stega-free fetch for build-time contexts such as
 * `generateStaticParams`, where there is no request / draft mode.
 */
export async function loadQueryStatic<T>(
  query: string,
  params: QueryParams = {},
): Promise<T | null> {
  try {
    const { data } = await sanityFetch({
      query,
      params,
      perspective: "published",
      stega: false,
    });
    return (data ?? null) as T | null;
  } catch (error) {
    console.error("[loadQueryStatic] Sanity fetch failed:", error);
    return null;
  }
}
