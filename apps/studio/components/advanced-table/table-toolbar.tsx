import { Button, Flex, Switch, Card, Text, Tooltip, Box } from "@sanity/ui";
import {
  AddIcon,
  RemoveIcon,
  InsertAboveIcon,
  InsertBelowIcon,
  ResetIcon,
} from "@sanity/icons";
import type { Selection } from "./table-utils";

interface TableToolbarProps {
  hasHeaderRow: boolean;
  selection: Selection | null;
  canMergeSelection: boolean;
  selectedCellIsMerged: boolean;
  rowCount: number;
  columnCount: number;
  onToggleHeader: () => void;
  onAddRow: (position: "before" | "after") => void;
  onDeleteRow: () => void;
  onAddColumn: () => void;
  onDeleteColumn: () => void;
  onMerge: () => void;
  onUnmerge: () => void;
}

export function TableToolbar({
  hasHeaderRow,
  selection,
  canMergeSelection,
  selectedCellIsMerged,
  rowCount,
  columnCount,
  onToggleHeader,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onMerge,
  onUnmerge,
}: TableToolbarProps) {
  const hasSelection = selection !== null;

  return (
    <Card padding={2} borderBottom style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--card-bg-color)" }}>
      <Flex align="center" gap={2} wrap="wrap">
        <Flex align="center" gap={2}>
          <Switch checked={hasHeaderRow} onChange={onToggleHeader} />
          <Text size={1} muted>
            Header row
          </Text>
        </Flex>

        <Box style={{ width: 1, height: 20, background: "var(--card-border-color)" }} />

        <Tooltip content={<Text size={1}>Add row above</Text>} placement="top">
          <Button
            icon={InsertAboveIcon}
            mode="bleed"
            tone="default"
            fontSize={1}
            padding={2}
            disabled={!hasSelection}
            onClick={() => onAddRow("before")}
          />
        </Tooltip>

        <Tooltip content={<Text size={1}>Add row below</Text>} placement="top">
          <Button
            icon={InsertBelowIcon}
            mode="bleed"
            tone="default"
            fontSize={1}
            padding={2}
            disabled={!hasSelection}
            onClick={() => onAddRow("after")}
          />
        </Tooltip>

        <Tooltip content={<Text size={1}>Delete row</Text>} placement="top">
          <Button
            icon={RemoveIcon}
            mode="bleed"
            tone="critical"
            fontSize={1}
            padding={2}
            disabled={!hasSelection || rowCount <= 1}
            onClick={onDeleteRow}
          />
        </Tooltip>

        <Box style={{ width: 1, height: 20, background: "var(--card-border-color)" }} />

        <Tooltip content={<Text size={1}>Add column</Text>} placement="top">
          <Button
            icon={AddIcon}
            mode="bleed"
            tone="default"
            fontSize={1}
            padding={2}
            onClick={onAddColumn}
            text="Col"
          />
        </Tooltip>

        <Tooltip content={<Text size={1}>Delete column</Text>} placement="top">
          <Button
            icon={RemoveIcon}
            mode="bleed"
            tone="critical"
            fontSize={1}
            padding={2}
            disabled={!hasSelection || columnCount <= 1}
            onClick={onDeleteColumn}
          />
        </Tooltip>

        <Box style={{ width: 1, height: 20, background: "var(--card-border-color)" }} />

        <Button
          mode="bleed"
          tone="primary"
          fontSize={1}
          padding={2}
          text="Merge"
          disabled={!canMergeSelection}
          onClick={onMerge}
        />

        <Button
          mode="bleed"
          tone="caution"
          fontSize={1}
          padding={2}
          text="Unmerge"
          disabled={!selectedCellIsMerged}
          onClick={onUnmerge}
        />
      </Flex>
    </Card>
  );
}
