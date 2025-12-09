export default function BreadCrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-gray-400">/</span>}
          {item.href ? (
            <a 
              href={item.href}
              className={`transition-colors ${
                item.active 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {item.label}
            </a>
          ) : (
            <span className={item.active ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}