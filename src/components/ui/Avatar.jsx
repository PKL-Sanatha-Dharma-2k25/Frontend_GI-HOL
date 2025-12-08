export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  name,
  badge,
  className = '',
  ...props
}) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBackgroundColor = (name) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover`}
          {...props}
        />
      ) : (
        <div
          className={`${sizes[size]} ${getBackgroundColor(name)} rounded-full flex items-center justify-center text-white font-semibold`}
          {...props}
        >
          {getInitials(name)}
        </div>
      )}
      {badge && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
}
