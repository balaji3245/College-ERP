export default function ProgressBar({ value, max = 100, color = 'indigo', showLabel = true, size = 'md' }) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const colorMap = {
    indigo: 'bg-indigo-600',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };
  const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  const barColor = percentage >= 75 ? colorMap.green : percentage >= 50 ? colorMap.yellow : colorMap.red;

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${heightMap[size]}`}>
        <div
          className={`${barColor} ${heightMap[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <span className="text-sm font-medium text-slate-600 w-10 text-right">{percentage}%</span>}
    </div>
  );
}
