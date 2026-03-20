import { useCallback, useEffect, useRef } from "react";
import { portableTextToHtml, htmlToPortableText } from "./pt-html-utils";
import type { SelectionInfo } from "./cell-formatting-toolbar";

interface TableCellEditorProps {
  cell: any;
  isHeader: boolean;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onContentChange: (content: any[]) => void;
  onSelectionInfo: (info: SelectionInfo | null) => void;
}

export function TableCellEditor({
  cell,
  isHeader,
  isSelected,
  onClick,
  onContentChange,
  onSelectionInfo,
}: TableCellEditorProps) {
  const isMerged = (cell.colspan || 1) > 1 || (cell.rowspan || 1) > 1;
  const divRef = useRef<HTMLDivElement>(null);

  // Ref callback: set innerHTML whenever the DOM element is created or recreated
  // (e.g., on mount, or when <td> switches to <th> on header toggle)
  const divCallbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      divRef.current = node;
      if (node) {
        node.innerHTML = portableTextToHtml(cell.content);
      }
    },
    // Re-run when cell._key changes (different cell) — not on every content edit
    [cell._key]
  );

  // Save on blur — skip if focus moved to toolbar/popover in the same grid
  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      const div = divRef.current;
      if (!div) return;
      const related = e.relatedTarget as HTMLElement | null;
      const gridContainer = div.closest("[data-table-grid]");
      if (related && gridContainer?.contains(related)) return;

      const ptBlocks = htmlToPortableText(div.innerHTML);
      onContentChange(ptBlocks);
      onSelectionInfo(null);
    },
    [onContentChange, onSelectionInfo]
  );

  // Track text selection for the formatting toolbar
  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || !div.contains(sel.anchorNode)) return;
      if (sel.isCollapsed) {
        onSelectionInfo(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const insideLink = isInsideTag(sel.anchorNode, "A");
      onSelectionInfo({
        rect: { top: rect.top, left: rect.left, width: rect.width },
        marks: new Set([
          ...(document.queryCommandState("bold") ? ["bold"] : []),
          ...(document.queryCommandState("italic") ? ["italic"] : []),
          ...(isInsideTag(sel.anchorNode, "CODE") ? ["code"] : []),
        ]),
        hasLink: insideLink,
        linkUrl: insideLink ? getLinkUrl(sel.anchorNode) : "",
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [onSelectionInfo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  }, []);

  // On link click: prevent navigation, select the link text, show toolbar
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkEl =
        target.tagName === "A"
          ? (target as HTMLAnchorElement)
          : (target.closest("a") as HTMLAnchorElement | null);
      if (!linkEl) return;

      e.preventDefault();

      // Select the full link text so the toolbar appears
      const range = document.createRange();
      range.selectNodeContents(linkEl);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);

      const rect = linkEl.getBoundingClientRect();
      onSelectionInfo({
        rect: { top: rect.top, left: rect.left, width: rect.width },
        marks: new Set([
          ...(document.queryCommandState("bold") ? ["bold"] : []),
          ...(document.queryCommandState("italic") ? ["italic"] : []),
          ...(isInsideTag(linkEl, "CODE") ? ["code"] : []),
        ]),
        hasLink: true,
        linkUrl: linkEl.href || "",
      });
    },
    [onSelectionInfo]
  );

  const Tag = isHeader ? "th" : "td";

  return (
    <Tag
      onMouseDown={(e: React.MouseEvent) => {
        // Only handle cell selection when clicking on the td padding, not inside contentEditable
        const target = e.target as HTMLElement;
        if (target.isContentEditable || target.closest("[contenteditable]"))
          return;
        // For cell selection (merge operations), prevent default to avoid text selection side effects
        onClick(e);
      }}
      style={{
        padding: "6px 8px",
        border: `2px solid ${isSelected ? "var(--card-focus-ring-color)" : "var(--card-border-color)"}`,
        background: isHeader
          ? "var(--card-bg2-color, #f3f3f6)"
          : "transparent",
        cursor: "text",
        position: "relative",
        verticalAlign: "top",
        minWidth: 80,
        fontWeight: isHeader ? 600 : 400,
        outline: "none",
        // Override Sanity UI's user-select: none that cascades from Card
        userSelect: "text",
        WebkitUserSelect: "text",
      }}
      colSpan={cell.colspan > 1 ? cell.colspan : undefined}
      rowSpan={cell.rowspan > 1 ? cell.rowspan : undefined}
    >
      <div
        ref={divCallbackRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className="table-cell-editable"
        style={{
          minHeight: 20,
          outline: "none",
          fontSize: 13,
          lineHeight: "20px",
          userSelect: "text",
          WebkitUserSelect: "text",
          cursor: "text",
        }}
      />
      {isMerged && (
        <span
          style={{
            position: "absolute",
            top: 1,
            right: 3,
            fontSize: 9,
            opacity: 0.5,
            pointerEvents: "none",
            color: "var(--card-muted-fg-color)",
          }}
        >
          {cell.colspan}×{cell.rowspan}
        </span>
      )}
    </Tag>
  );
}

function getLinkUrl(node: Node | null): string {
  let current = node;
  while (current) {
    if (
      current.nodeType === Node.ELEMENT_NODE &&
      (current as HTMLElement).tagName === "A"
    ) {
      return (current as HTMLAnchorElement).href || "";
    }
    current = current.parentNode;
  }
  return "";
}

function isInsideTag(node: Node | null, tagName: string): boolean {
  let current = node;
  while (current) {
    if (
      current.nodeType === Node.ELEMENT_NODE &&
      (current as HTMLElement).tagName === tagName
    ) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
}
