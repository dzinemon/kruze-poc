import { iconRegistry } from "./registry";
import type { IconName } from "./registry";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, className, size = 24, strokeWidth = 1.5 }: IconProps) {
  const Component = iconRegistry[name];
  if (!Component) return null;
  return (
    <Component
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}
