import { useState } from 'react';
import { LayoutDashboard, Bookmark, Settings as SettingsIcon, HelpCircle, ChevronRight, ChevronLeft, Menu } from 'lucide-react';

const Sidebar = ({ activeTab, onChangeTab, savedCount }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className={`border-r border-slate-800 bg-slate-950/95 p-4 hidden lg:flex flex-col transition-all duration-300 ${isExpanded ? 'w-[260px]' : 'w-[80px]'}`}>
      <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} mb-6`}>
        {isExpanded && (
          <div className="flex-1">
            <div className="border border-slate-800 rounded-2xl p-3 bg-slate-900/50">
              <h2 className="text-sm font-bold text-white">Menu Utama</h2>
              <p className="text-[10px] text-slate-500 mt-1">Area kerja & koleksi</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ${isExpanded ? 'ml-3' : ''}`}
          title={isExpanded ? "Perkecil Sidebar" : "Perbesar Sidebar"}
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { key: 'saved', label: 'Daftar Tersimpan', icon: Bookmark, badge: savedCount },
          { key: 'settings', label: 'Pengaturan', icon: SettingsIcon },
          { key: 'help', label: 'Panduan', icon: HelpCircle }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onChangeTab(item.key)}
              title={!isExpanded ? item.label : undefined}
              className={`w-full flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} p-3 rounded-2xl transition ${activeTab === item.key ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                {isExpanded && <span className="whitespace-nowrap text-sm font-medium">{item.label}</span>}
              </div>
              {isExpanded && (
                item.badge !== undefined && item.badge !== 0 
                  ? <span className="text-[10px] bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-2 py-0.5 rounded-full">{item.badge}</span> 
                  : <ChevronRight className="h-4 w-4 opacity-50 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
