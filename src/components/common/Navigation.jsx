export default function Navigation({ 
  items = [], 
  active = null, 
  onSelect = () => {},
  vertical = false 
}) {
  return (
    <nav className={`flex gap-4 ${vertical ? 'flex-col' : 'flex-row'} border-b border-gray-200`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`px-4 py-2 font-medium transition ${
            active === item.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}