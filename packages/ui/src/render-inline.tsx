import { Fragment } from "react";

export interface RawSpan {
  _type: string;
  text?: string;
  marks?: string[];
}

/** Render an array of Sanity portable-text spans as React nodes (strong + em). */
export function renderInline(children: RawSpan[]): React.ReactNode {
  if (!Array.isArray(children)) return null;
  return children.map((child, i) => {
    if (child._type === "break") return <br key={i} />;
    let node: React.ReactNode = child.text ?? "";
    if (child.marks?.includes("strong")) node = <strong key={i}>{node}</strong>;
    if (child.marks?.includes("em")) node = <em key={i}>{node}</em>;
    return <Fragment key={i}>{node}</Fragment>;
  });
}
