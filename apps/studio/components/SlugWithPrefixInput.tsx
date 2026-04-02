import { set, unset, type SlugInputProps } from "sanity";
import { Flex, Text, Box, Button } from "@sanity/ui";
import { CopyIcon, CheckmarkIcon } from "@sanity/icons";
import { useCallback, useState } from "react";

interface Props extends SlugInputProps {
  prefix: string;
  suffix?: string;
  baseUrl?: string;
}

export function SlugWithPrefixInput({ prefix, suffix, baseUrl, value, onChange, elementProps }: Props) {
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value;
      onChange(val ? set({ _type: "slug", current: val }) : unset());
    },
    [onChange],
  );

  const handleCopy = useCallback(() => {
    const url = `${baseUrl}${prefix}${value?.current ?? ""}${suffix ?? ""}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [baseUrl, prefix, suffix, value]);

  return (
    <Flex align="center" gap={0}>
      <Box
        padding={3}
        style={{
          background: "var(--card-muted-bg-color)",
          border: "1px solid var(--card-border-color)",
          borderRight: "none",
          borderRadius: "3px 0 0 3px",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        <Text size={1} muted>{prefix}</Text>
      </Box>
      <input
        {...elementProps}
        type="text"
        value={value?.current ?? ""}
        onChange={handleChange}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "9px 12px",
          fontSize: "var(--font-size-1)",
          fontFamily: "var(--font-family-code)",
          background: "var(--card-bg-color)",
          color: "var(--card-fg-color)",
          border: "1px solid var(--card-border-color)",
          borderRadius: 0,
          outline: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 1px var(--card-focus-ring-color)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {suffix && (
        <Box
          padding={3}
          style={{
            background: "var(--card-muted-bg-color)",
            border: "1px solid var(--card-border-color)",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: 0,
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          <Text size={1} muted>{suffix}</Text>
        </Box>
      )}
      <Button
        mode="ghost"
        icon={copied ? CheckmarkIcon : CopyIcon}
        disabled={!value?.current || !baseUrl}
        onClick={handleCopy}
        title="Copy full URL"
        style={{
          border: "1px solid var(--card-border-color)",
          borderLeft: suffix ? "none" : undefined,
          borderRadius: "0 3px 3px 0",
        }}
      />
    </Flex>
  );
}
