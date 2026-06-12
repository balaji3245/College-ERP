export default function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="overflow-x-auto scrollbar-thin -mx-3 sm:mx-0 px-3 sm:px-0">
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-max sm:w-full sm:flex-wrap min-w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {tab.icon && <tab.icon size={13} />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
