import { draftMode } from "next/headers";

import { SanityLive } from "@/sanity/live";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { EditorShortcuts } from "@/components/EditorShortcuts";
import { InsertPalette } from "@/components/InsertPalette";
import { CanvasAddButton } from "@/components/CanvasAddButton";
import { CanvasLogo3dEditor } from "@/components/CanvasLogo3dEditor";
import { PreviewBridge } from "@/components/PreviewBridge";
import { CanvasResizer } from "@/components/CanvasResizer";
import { SpacingResizer } from "@/components/SpacingResizer";
import { BlockMarginResizer } from "@/components/BlockMarginResizer";
import { SectionSpacingResizer } from "@/components/SectionSpacingResizer";
import { VisualEditingBridge } from "@/components/VisualEditingBridge";

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <>
      {children}
      {/* Live updates for published content and drafts alike. */}
      <SanityLive includeDrafts={isEnabled} />
      {isEnabled && (
        <>
          <VisualEditingBridge />
          <PreviewBridge />
          <EditorShortcuts />
          <InsertPalette />
          <CanvasAddButton />
          <CanvasLogo3dEditor />
          <CanvasResizer />
          <SpacingResizer />
          <BlockMarginResizer />
          <SectionSpacingResizer />
          <DisableDraftMode />
        </>
      )}
    </>
  );
}
