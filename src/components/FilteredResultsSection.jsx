import { useState } from 'react';
import { Save, Copy, FileDown, Folder, ChevronDown, ChevronUp } from 'lucide-react';
import SectionCard from './SectionCard';

const FilteredResultsSection = ({ 
  filteredData, 
  groupedResults, 
  onSave, 
  onCopy, 
  onExport,
  filterInclude,
  filterExclude
}) => {
  const [viewMode, setViewMode] = useState('group'); // 'group' or 'flat'
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <SectionCard
      title="Hasil Filter (Siap Pakai)"
      icon={<span className="w-2 h-2 rounded-full bg-emerald-400" />}
      badge={filteredData.length}
    >
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition"
          >
            <Save className="h-4 w-4" /> Simpan List
          </button>
          <button
            onClick={() => onCopy(filteredData)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            <Copy className="h-4 w-4" /> Copy
          </button>
          <button
            onClick={() => onExport(filteredData)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition"
          >
            <FileDown className="h-4 w-4" /> Ekspor CSV
          </button>
        </div>
      </div>

      {/* Model Representasi */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Model Representasi:</span>
          <div className="flex rounded-lg border border-slate-700 p-1 bg-slate-900">
            <button
              onClick={() => setViewMode('group')}
              className={`px-3 py-1.5 text-[11px] rounded-md transition ${viewMode === 'group' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Grup Kategori
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1.5 text-[11px] rounded-md transition ${viewMode === 'flat' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Daftar Rata (Flat)
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-emerald-400">Filter aktif:</span>
          <span className="px-2 py-0.5 border border-slate-600 rounded-full text-slate-300">
            {filterInclude ? `In: "${filterInclude}"` : 'In: Semua Data'}
          </span>
          {filterExclude && (
            <span className="px-2 py-0.5 border border-rose-900/50 bg-rose-500/10 rounded-full text-rose-400">
              Ex: "{filterExclude}"
            </span>
          )}
        </div>
      </div>

      {/* Results View */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 max-h-[500px] overflow-y-auto p-4">
        {filteredData.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">Tidak ada hasil filter.</div>
        ) : viewMode === 'flat' ? (
          <table className="min-w-full text-left text-sm relative">
            <thead className="sticky top-0 bg-slate-950 text-slate-400 text-[11px] uppercase tracking-[0.15em] z-10 pb-2">
              <tr>
                <th className="px-4 py-3 border-b border-slate-800">Tanggal</th>
                <th className="px-4 py-3 border-b border-slate-800">Kata Pencarian</th>
                <th className="px-4 py-3 border-b border-slate-800 text-right">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredData.map((row, index) => (
                <tr key={`${row.keyword}-${index}`} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-[12px] font-mono whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3 text-slate-200 font-medium">{row.keyword}</td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{row.volume.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedResults).map(([category, items]) => {
              const totalVolume = items.reduce((sum, item) => sum + item.volume, 0);
              const isExpanded = expandedCategories[category];
              
              return (
                <div key={category} className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
                  <button 
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-indigo-400" />
                      <span className="font-semibold text-slate-200 capitalize">{category}</span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{items.length} Kata</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 text-sm font-semibold">Vol: {totalVolume.toLocaleString('id-ID')}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="p-0 border-t border-slate-800 bg-slate-950/50">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="px-6 py-2 font-medium">Tanggal</th>
                            <th className="px-6 py-2 font-medium">Kata Pencarian</th>
                            <th className="px-6 py-2 text-right font-medium">Volume</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {items.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/30">
                              <td className="px-6 py-2 text-slate-500 text-[11px] font-mono">{row.date}</td>
                              <td className="px-6 py-2 text-slate-300 text-[12px]">{row.keyword}</td>
                              <td className="px-6 py-2 text-right text-emerald-500/80 text-[12px] font-medium">{row.volume.toLocaleString('id-ID')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default FilteredResultsSection;
