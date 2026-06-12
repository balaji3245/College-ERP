export default function Badge({ children, variant = 'gray' }) {
  const variants = {
    green: 'badge-green',
    red: 'badge-red',
    yellow: 'badge-yellow',
    blue: 'badge-blue',
    indigo: 'badge-indigo',
    gray: 'badge-gray',
    purple: 'badge-purple',
  };
  return <span className={variants[variant] || 'badge-gray'}>{children}</span>;
}
