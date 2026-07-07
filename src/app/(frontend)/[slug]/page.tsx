import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { loadQuery, loadQueryStatic } from "@/sanity/fetch";
import {
  PAGE_QUERY,
  PAGE_META_QUERY,
  PAGES_SLUGS_QUERY,
} from "@/sanity/queries";
import { PageBuilder } from "@/components/PageBuilder";
import type { Page } from "@/lib/types";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await loadQueryStatic<{ slug: string }[]>(PAGES_SLUGS_QUERY);
  return (slugs ?? [])
    .filter((s) => s.slug && s.slug !== "home")
    .map((s) => ({ slug: s.slug }));
}

type PageMeta = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
} | null;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = await loadQuery<PageMeta>(PAGE_META_QUERY, { slug });
  return {
    title: meta?.metaTitle || meta?.title || undefined,
    description: meta?.metaDescription || undefined,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = await loadQuery<Page>(PAGE_QUERY, { slug });
  if (!page) notFound();
  return <PageBuilder page={page} query={PAGE_QUERY} params={{ slug }} />;
}
