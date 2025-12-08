import { useState } from 'react';

export default function Tabs({
  tabs = [],
  defaultActive = 0,
  onChange,
  className = '',
}) {
  const [active, setActive] = useState(defaultActive);

  const handleTabChange = (index) => {
    setActive(index);
    onChange?.(index);
  };

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 gap-1">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`
              px-4 py-3 font-medium transition-colors relative
              ${active === index
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
