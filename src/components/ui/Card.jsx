export default function Card({
  children,
  className = '',
  shadow = 'md',
  padding = 'md',
  rounded = 'lg',
  border = false,
  hoverEffect = false,
  ...props
}) {
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const roundeds = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };

  return (
    <div
      className={`
        bg-white 
        ${shadows[shadow]} 
        ${paddings[padding]} 
        ${roundeds[rounded]}
        ${border ? 'border border-gray-200' : ''}
        ${hoverEffect ? 'hover:shadow-xl transition duration-300 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
