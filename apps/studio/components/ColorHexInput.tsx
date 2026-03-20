import { set, unset, type StringInputProps } from "sanity";
import { TextInput, Flex } from "@sanity/ui";
import { useCallback } from "react";

/**
 * Custom string input that pairs a native color picker with a hex text field.
 * Used for the chart colors array — keeps the data as plain "#RRGGBB" strings.
 */
export function ColorHexInput(props: StringInputProps) {
  const { value, onChange, elementProps } = props;

  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hex = e.target.value;
      onChange(hex ? set(hex) : unset());
    },
    [onChange],
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value;
      onChange(val ? set(val) : unset());
    },
    [onChange],
  );

  return (
    <Flex align="center" gap={2}>
      <input
        type="color"
        value={value || "#000000"}
        onChange={handlePickerChange}
        style={{
          width: 36,
          height: 32,
          padding: 0,
          border: "1px solid var(--card-border-color)",
          borderRadius: 4,
          cursor: "pointer",
          background: "none",
        }}
      />
      <TextInput
        {...elementProps}
        value={value ?? ""}
        onChange={handleTextChange}
        placeholder="#000000"
        style={{ fontFamily: "monospace" }}
      />
    </Flex>
  );
}
