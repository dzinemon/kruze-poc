import { Info, TriangleAlert, CircleCheck, CircleX } from "lucide-react";
import { renderInline } from "../render-inline";
import { heading, text } from "../styles";

const alertConfig = {
  info: {
    classes: "bg-info-bg border-info-border text-info-text",
    Icon: Info,
  },
  warning: {
    classes: "bg-warning-bg border-warning-border text-warning-text",
    Icon: TriangleAlert,
  },
  success: {
    classes: "bg-success-bg border-success-border text-success-text",
    Icon: CircleCheck,
  },
  danger: {
    classes: "bg-danger-bg border-danger-border text-danger-text",
    Icon: CircleX,
  },
};

interface AlertBlockProps {
  type: keyof typeof alertConfig;
  content: any[];
}

function renderBlocks(blocks: any[]): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(
        <ul key={`list-${result.length}`} className="list-disc list-inside space-y-1">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block._type !== "block") continue;
    const key = block._key ?? i;
    const children = renderInline(block.children ?? []);

    if (block.listItem === "bullet") {
      listItems.push(<li key={key}>{children}</li>);
      continue;
    }

    flushList();

    const style = block.style ?? "normal";
    if (style === "h2") {
      result.push(<h2 key={key} className={heading.h2}>{children}</h2>);
    } else if (style === "h3") {
      result.push(<h3 key={key} className={heading.h3}>{children}</h3>);
    } else if (style === "h4") {
      result.push(<h4 key={key} className={heading.h4}>{children}</h4>);
    } else {
      result.push(<p key={key} className={text.body}>{children}</p>);
    }
  }

  flushList();
  return result;
}

export function AlertBlock({ type = "info", content }: AlertBlockProps) {
  const { classes, Icon } = alertConfig[type];
  return (
    <div className={`my-8 p-4 border rounded-sm flex items-start gap-3 ${classes}`}>
      <Icon className="size-5 flex-shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden="true" />
      <div className="text-base leading-relaxed space-y-3">
        {Array.isArray(content)
          ? renderBlocks(content)
          : <p>{content}</p>}
      </div>
    </div>
  );
}
