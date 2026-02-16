const alertStyles = {
  info: { bg: "bg-blue-50", border: "border-info", text: "text-primary-dark" },
  warning: {
    bg: "bg-yellow-50",
    border: "border-warning",
    text: "text-yellow-800",
  },
  success: {
    bg: "bg-green-50",
    border: "border-success",
    text: "text-green-800",
  },
  danger: { bg: "bg-red-50", border: "border-danger", text: "text-red-800" },
};

interface AlertBlockProps {
  type: keyof typeof alertStyles;
  content: string;
}

export function AlertBlock({ type = "info", content }: AlertBlockProps) {
  const styles = alertStyles[type];
  return (
    <div
      className={`my-8 p-4 border-l-4 rounded-md ${styles.bg} ${styles.border} ${styles.text}`}
    >
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}
