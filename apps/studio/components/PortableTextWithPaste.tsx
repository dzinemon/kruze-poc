import { useEffect, useRef } from "react";
import { type ArrayOfObjectsInputProps, insert, PatchEvent } from "sanity";
import {
  parseHtmlTableAdvanced,
  parseTsvTable,
  buildAdvancedTableBlock,
} from "./advanced-table/table-paste-handler";

export function PortableTextWithPaste(props: ArrayOfObjectsInputProps) {
  const onChangeRef = useRef(props.onChange);
  onChangeRef.current = props.onChange;

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;

      // Skip pastes into table cell editors (they have their own handler)
      const target = e.target as HTMLElement;
      if (target.closest("[data-table-grid]")) return;

      // Skip pastes into regular inputs/textareas
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const html = e.clipboardData.getData("text/html");
      const plain = e.clipboardData.getData("text/plain");

      let parsed = null;

      if (html && html.includes("<table")) {
        parsed = parseHtmlTableAdvanced(html);
      } else if (plain && plain.includes("\t")) {
        parsed = parseTsvTable(plain);
      }

      if (!parsed) return;

      e.preventDefault();
      e.stopPropagation();

      const block = buildAdvancedTableBlock(parsed);
      onChangeRef.current(PatchEvent.from(insert([block], "after", [-1])));
    };

    // Listen on document so we catch pastes in expanded editor portals too
    document.addEventListener("paste", handler, { capture: true });
    return () => document.removeEventListener("paste", handler, { capture: true });
  }, []);

  return props.renderDefault(props);
}
