
export default function VerticalLayout({
  header = null,
  content = null,
  footer = null
}) {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      {header && <div className="flex-shrink-0">{header}</div>}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {content}
      </div>

      {/* Footer */}
      {footer && <div className="flex-shrink-0">{footer}</div>}
    </div>
  );
}
