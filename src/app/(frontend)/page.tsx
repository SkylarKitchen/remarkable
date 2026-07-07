import type { Metadata } from "next";

import { loadQuery } from "@/sanity/fetch";
import { PAGE_QUERY, PAGE_META_QUERY } from "@/sanity/queries";
import { PageBuilder } from "@/components/PageBuilder";
import { Welcome } from "@/components/Welcome";
import type { Page } from "@/lib/types";

type PageMeta = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
} | null;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await loadQuery<PageMeta>(PAGE_META_QUERY, { slug: "home" });
  return {
    title: meta?.metaTitle || meta?.title || undefined,
    description: meta?.metaDescription || undefined,
  };
}

export default async function HomePage() {
  const page = await loadQuery<Page>(PAGE_QUERY, { slug: "home" });
  if (!page) return <Welcome />;
  return <PageBuilder page={page} query={PAGE_QUERY} params={{ slug: "home" }} />;
}
