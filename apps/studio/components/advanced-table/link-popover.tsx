import { useCallback, useRef, useState } from "react";
import { Button, Card, Flex, TextInput } from "@sanity/ui";
import { CheckmarkIcon, TrashIcon } from "@sanity/icons";

interface LinkPopoverProps {
  initialUrl: string;
  position: { top: number; left: number };
  onConfirm: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export function LinkPopover({
  initialUrl,
  position,
  onConfirm,
  onRemove,
  onClose,
}: LinkPopoverProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (url.trim()) {
        onConfirm(url.trim());
      }
    },
    [url, onConfirm]
  );

  return (
    <Card
      shadow={2}
      radius={2}
      padding={2}
      style={{
        position: "absolute",
        top: position.top,
        left: Math.max(0, position.left),
        zIndex: 30,
        background: "var(--card-bg-color)",
        width: 300,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Flex align="center" gap={1}>
          <TextInput
            ref={inputRef}
            fontSize={1}
            padding={2}
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                onClose();
              }
            }}
            style={{ flex: 1 }}
          />
          <Button
            icon={CheckmarkIcon}
            mode="bleed"
            tone="positive"
            fontSize={1}
            padding={2}
            type="submit"
            title="Apply link"
          />
          {initialUrl && (
            <Button
              icon={TrashIcon}
              mode="bleed"
              tone="critical"
              fontSize={1}
              padding={2}
              onClick={onRemove}
              title="Remove link"
            />
          )}
        </Flex>
      </form>
    </Card>
  );
}
