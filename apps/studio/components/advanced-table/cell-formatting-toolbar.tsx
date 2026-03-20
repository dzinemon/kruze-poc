import { useCallback } from "react";
import { Button, Card, Flex } from "@sanity/ui";
import { BoldIcon, ItalicIcon, CodeIcon, LinkIcon } from "@sanity/icons";

export interface SelectionInfo {
  rect: { top: number; left: number; width: number };
  marks: Set<string>;
  hasLink: boolean;
  linkUrl: string;
}

interface CellFormattingToolbarProps {
  info: SelectionInfo;
  containerRect: DOMRect | null;
  onToggleLink: () => void;
}

export function CellFormattingToolbar({
  info,
  containerRect,
  onToggleLink,
}: CellFormattingToolbarProps) {
  const toggleMark = useCallback((command: string) => {
    document.execCommand(command, false);
  }, []);

  if (!containerRect) return null;

  const top = info.rect.top - containerRect.top - 36;
  const left = info.rect.left - containerRect.left + info.rect.width / 2 - 80;

  return (
    <Card
      shadow={2}
      radius={2}
      padding={1}
      // Prevent toolbar from stealing focus — keeps text selection alive in contentEditable
      onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
      style={{
        position: "absolute",
        top: Math.max(0, top),
        left: Math.max(0, left),
        zIndex: 20,
        background: "var(--card-bg-color)",
      }}
    >
      <Flex align="center" gap={1}>
        <Button
          icon={BoldIcon}
          mode="bleed"
          tone={info.marks.has("bold") ? "primary" : "default"}
          fontSize={1}
          padding={2}
          onClick={() => toggleMark("bold")}
          title="Bold"
        />
        <Button
          icon={ItalicIcon}
          mode="bleed"
          tone={info.marks.has("italic") ? "primary" : "default"}
          fontSize={1}
          padding={2}
          onClick={() => toggleMark("italic")}
          title="Italic"
        />
        <Button
          icon={CodeIcon}
          mode="bleed"
          tone={info.marks.has("code") ? "primary" : "default"}
          fontSize={1}
          padding={2}
          onClick={() => {
            // execCommand doesn't have a "code" command — wrap with insertHTML
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) return;
            const range = sel.getRangeAt(0);
            const selectedText = range.toString();
            // Check if already inside a <code>
            const parent = range.commonAncestorContainer.parentElement;
            if (parent?.tagName.toLowerCase() === "code") {
              // Unwrap: replace <code> with its text content
              const text = document.createTextNode(parent.textContent || "");
              parent.parentNode?.replaceChild(text, parent);
            } else {
              document.execCommand(
                "insertHTML",
                false,
                `<code>${selectedText}</code>`
              );
            }
          }}
          title="Code"
        />
        <Button
          icon={LinkIcon}
          mode="bleed"
          tone={info.hasLink ? "primary" : "default"}
          fontSize={1}
          padding={2}
          onClick={onToggleLink}
          title="Link"
        />
      </Flex>
    </Card>
  );
}
