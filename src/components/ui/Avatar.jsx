import { getInitials } from '../../utils/helpers';

export default function Avatar({ name, size = 'md', color = '6366f1' }) {
  const sizeMap = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };
  const initials = getInitials(name || '?');

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: `#${color}` }}
    >
      {initials}
    </div>
  );
}
