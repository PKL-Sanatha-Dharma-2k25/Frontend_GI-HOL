// src/components/layout/HorizontalLayout.jsx
export default function HorizontalLayout({
  header = null,
  sidebar = null,
  footer = null,
  children = null,
  sidebarOpen = true
}) {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      {header && <div className="sticky top-0 z-30">{header}</div>}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && <div className="flex-shrink-0">{sidebar}</div>}

        {/* Content */}
        <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
          
          {/* Footer */}
          {footer && <div className="flex-shrink-0 sticky bottom-0">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
