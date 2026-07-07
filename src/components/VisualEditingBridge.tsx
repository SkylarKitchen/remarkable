"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VisualEditing } from "@sanity/visual-editing/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { KeyboardReorder } from "./KeyboardReorder";
import { INSERT_DEFAULTS } from "@/lib/blockDefaults";

type NavigateUpdate = { type: "push" | "replace" | "pop"; url: string };

/**
 * Renders `@sanity/visual-editing/react`'s VisualEditing DIRECTLY, instead of
 * `next-sanity`'s `next/dynamic` wrapper.
 *
 * Why: `useOptimistic` reads a module-global "actor" set by VisualEditing. When
 * VisualEditing is code-split into a `next/dynamic` chunk, that global is
 * DUPLICATED across chunks, so the actor VisualEditing populates is invisible
 * to `useOptimistic` and per-keystroke updates silently never arrive. Importing
 * both from the same entry, statically, keeps them in one chunk → one actor.
 *
 * We replicate next-sanity's Next.js history adapter (router push/replace/back
 * + path sync) and only render after mount to stay SSR-safe.
 */
export function VisualEditingBridge() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Expose the block insert defaults to the patched `getArrayInsertPatches` in
  // @sanity/visual-editing, which runs in this same preview window and reads
  // them off globalThis. Upstream inserts a bare {_type,_key}; without this a
  // canvas-inserted text block has no text and renders null. See blockDefaults.
  useEffect(() => {
    (
      globalThis as { __sanityInsertDefaults?: typeof INSERT_DEFAULTS }
    ).__sanityInsertDefaults = INSERT_DEFAULTS;
  }, []);

  const router = useRouter();
  const [navigate, setNavigate] = useState<
    ((update: NavigateUpdate) => void) | undefined
  >();

  const history = useMemo(
    () => ({
      subscribe: (nav: (update: NavigateUpdate) => void) => {
        setNavigate(() => nav);
        return () => setNavigate(undefined);
      },
      update: (update: NavigateUpdate) => {
        switch (update.type) {
          case "push":
            router.push(update.url);
            return;
          case "replace":
            router.replace(update.url);
            return;
          case "pop":
            router.back();
            return;
        }
      },
    }),
    [router],
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!navigate) return;
    const qs = searchParams?.size ? `?${searchParams.toString()}` : "";
    navigate({ type: "push", url: `${pathname}${qs}` });
  }, [navigate, pathname, searchParams]);

  const handleRefresh = useCallback(
    (payload: { source: "manual" | "mutation" }) => {
      if (payload.source === "manual") {
        router.refresh();
        return new Promise<void>((resolve) => setTimeout(resolve, 1000));
      }
      // "mutation": optimistic already applied it — skip the server refresh so
      // the preview doesn't flash back to stale content after each save.
      return false as const;
    },
    [router],
  );

  if (!mounted) return null;

  return (
    <>
      <VisualEditing
        history={history as never}
        portal
        refresh={handleRefresh as never}
      />
      {/* Shift+Arrow reordering — shares VisualEditing's optimistic actor by
          being imported from the same static entry (see note above). */}
      <KeyboardReorder />
    </>
  );
}
