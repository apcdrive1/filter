import { useState } from 'react';
import { Bookmark, TrendingUp, Clock, Copy, Download, Trash2, Folder, ChevronRight, Activity, X } from 'lucide-react';
import { guessCategory } from '@/lib/utils';

export default function SavedListView({ savedLists, onLoadToDashboard, onCopy, onDownload, onDelete, onDeleteGroup }) {
  const [gridMode, setGridMode] = useState(true);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);
  const [selectedDates, setSelectedDates] = useState({});

  const handleDateChange = (listId, date) => {
    setSelectedDates(prev => ({ ...prev, [listId]: date }));
  };

  const handleLoad = (list) => {
    const date = selectedDates[list.id] || 'all';
    if (date === 'all') {
      onLoadToDashboard(list);
    } else {
      const filtered = list.items.filter(i => i.date === date);
      onLoadToDashboard({ ...list, name: `${list.name} (${date})`, items: filtered });
    }
  };

  const getTrendValue = (keyword, allItems) => {
    const keywordItems = allItems.filter(item => item.keyword === keyword);
    keywordItems.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    const volumes = keywordItems.map(item => item.volume);
    if (volumes.length <= 1) return 0;
    return volumes[volumes.length - 1] - volumes[0];
  };

  const sortItems = (items, allItems) => {
    return [...items].sort((a, b) => {
      const dateDiff = new Date(b.date || 0) - new Date(a.date || 0);
      if (dateDiff !== 0) return dateDiff;
      
      const trendA = getTrendValue(a.keyword, allItems);
      const trendB = getTrendValue(b.keyword, allItems);
      const isRisingA = trendA > 0 ? 1 : (trendA < 0 ? -1 : 0);
      const isRisingB = trendB > 0 ? 1 : (trendB < 0 ? -1 : 0);
      if (isRisingA !== isRisingB) return isRisingB - isRisingA;
      
      return b.volume - a.volume;
    });
  };

  const getSparklinePath = (keyword, allItems) => {
    const keywordItems = allItems.filter(item => item.keyword === keyword);
    keywordItems.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    const volumes = keywordItems.map(item => item.volume);
    
    if (volumes.length <= 1) return "M1 6 L31 6";

    const minVol = Math.min(...volumes);
    const maxVol = Math.max(...volumes);
    const range = maxVol - minVol;
    
    const minX = 1;
    const maxX = 31;
    const minY = 10.5;
    const maxY = 1.5;
    
    const stepX = (maxX - minX) / (volumes.length - 1);
    
    const points = volumes.map((vol, index) => {
      const x = minX + index * stepX;
      const y = range === 0 ? (minY + maxY) / 2 : minY - ((vol - minVol) / range) * (minY - maxY);
      return `${x} ${y}`;
    });
    
    return `M${points[0]} ` + points.slice(1).map(p => `L${p}`).join(' ');
  };

  if (savedLists.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full p-6 text-slate-500">
        <div className="text-center">
          <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h2 className="text-lg font-medium text-slate-300">Belum Ada Daftar Tersimpan</h2>
          <p className="text-sm mt-2">Simpan hasil filter dari dashboard untuk melihatnya di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-indigo-400" />
              Koleksi Riset Tersimpan Anda
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Kategori tersusun rapi dua-dua ke bawah. Klik pada salah satu kartu kategori untuk memantau detail tren spreadsheet secara menyeluruh.
            </p>
          </div>
          <button 
            onClick={() => setGridMode(!gridMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-900 bg-emerald-900/20 text-emerald-400 text-sm font-medium hover:bg-emerald-900/40 transition whitespace-nowrap"
          >
            <Activity className="h-4 w-4" />
            Mode Grid {gridMode ? 'Dua-Dua Aktif' : 'Non-aktif'}
          </button>
        </div>

        {/* Lists Container */}
        <div className="space-y-8">
          {savedLists.map((list) => {
            // Group the items in this list by category
            const grouped = list.items.reduce((acc, item) => {
              const cat = guessCategory(item.keyword);
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(item);
              return acc;
            }, {});

            const categories = Object.keys(grouped);
            
            return (
              <div key={list.id} className="border border-slate-800 rounded-3xl bg-slate-900/40 overflow-hidden">
                {/* List Header */}
                <div className="p-5 border-b border-slate-800/60 bg-slate-900/80 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white">{list.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Dibuat: {list.createdAt}
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <div className="px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50">
                        {categories.length} Grup Kategori Terdeteksi
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <div>Total Transaksi Data: {list.items.length} Baris</div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 xl:mt-0">
                    <div className="flex items-center bg-slate-900 border border-indigo-500/30 rounded-xl overflow-hidden">
                      <select 
                        className="bg-transparent text-xs text-indigo-200 outline-none cursor-pointer py-2 pl-3 pr-2 border-r border-indigo-500/30"
                        value={selectedDates[list.id] || 'all'}
                        onChange={(e) => handleDateChange(list.id, e.target.value)}
                      >
                        <option value="all" className="bg-slate-900 text-indigo-200">Semua Tanggal</option>
                        {[...new Set(list.items.map(i => i.date))]
                          .filter(Boolean)
                          .sort((a, b) => new Date(b) - new Date(a))
                          .map(d => (
                            <option key={d} value={d} className="bg-slate-900 text-indigo-200">{d}</option>
                          ))}
                      </select>
                      <button 
                        onClick={() => handleLoad(list)}
                        className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold transition whitespace-nowrap"
                      >
                        Muat & Sortir
                      </button>
                    </div>
                    <button 
                      onClick={() => onCopy(list.items)}
                      className="p-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition"
                      title="Salin Data"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDownload(list.items, list.name)}
                      className="p-2 border border-emerald-900/50 text-emerald-500 rounded-xl hover:bg-emerald-900/20 transition"
                      title="Unduh CSV"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(list.id)}
                      className="p-2 border border-red-900/50 text-red-500 rounded-xl hover:bg-red-900/20 transition ml-2"
                      title="Hapus Daftar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className={`p-5 grid gap-5 ${gridMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  {categories.map((cat, idx) => {
                    const items = grouped[cat];
                    const sortedItems = sortItems(items, list.items);
                    const topItems = sortedItems.slice(0, 5);
                    const totalVol = items.reduce((sum, it) => sum + it.volume, 0);
                    
                    return (
                      <div key={idx} className="border border-slate-800 rounded-2xl bg-slate-950 p-4 flex flex-col">
                        {/* Category Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-start gap-3">
                            <Folder className="h-6 w-6 text-indigo-400 mt-1" />
                            <div>
                              <h3 className="font-bold text-white text-base">{cat}</h3>
                              <p className="text-xs text-slate-500 mt-0.5">{items.length} Keyword Terkelompok</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
                              Vol: {totalVol.toLocaleString('id-ID')}
                            </div>
                            <button 
                              onClick={() => onDeleteGroup(list.id, cat)}
                              className="p-1.5 ml-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                              title="Hapus Grup Ini"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Category Table */}
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
                            <span>Kata Kunci Unggulan</span>
                            <span>Tren / Volume</span>
                          </div>
                          
                          <div className="space-y-2">
                            {topItems.map((item, i) => {
                              const trendValue = getTrendValue(item.keyword, list.items);
                              const trendColor = trendValue > 0 ? 'text-emerald-400' : (trendValue < 0 ? 'text-rose-400' : 'text-slate-400');
                              return (
                              <div key={i} className="flex items-center justify-between text-sm group">
                                <div className="flex items-center gap-3 truncate pr-4">
                                  <span className="w-5 h-5 rounded flex items-center justify-center bg-slate-800 text-[10px] text-slate-400 shrink-0">
                                    {i + 1}
                                  </span>
                                  <span className="text-slate-300 truncate group-hover:text-white transition">{item.keyword}</span>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`opacity-70 ${trendColor}`}>
                                    <path d={getSparklinePath(item.keyword, list.items)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className="text-slate-100 font-medium w-16 text-right">{item.volume.toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Category Footer */}
                        <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                          <span>Klik untuk semua data</span>
                          <button 
                            onClick={() => setSelectedCategoryData({ categoryName: cat, items: grouped[cat] })}
                            className="flex items-center text-slate-300 hover:text-white transition"
                          >
                            Selengkapnya <ChevronRight className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Details Modal */}
      {selectedCategoryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <Folder className="h-6 w-6 text-indigo-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedCategoryData.categoryName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Total {selectedCategoryData.items.length} Kata Kunci</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategoryData(null)} 
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">
                <span>Kata Kunci</span>
                <span>Tren / Volume</span>
              </div>
              
              <div className="space-y-1">
                {selectedCategoryData && sortItems(selectedCategoryData.items, selectedCategoryData.items).map((item, i) => {
                  const keywordCount = selectedCategoryData.items.filter(k => k.keyword === item.keyword).length;
                  const trendValue = getTrendValue(item.keyword, selectedCategoryData.items);
                  const trendColor = trendValue > 0 ? 'text-emerald-400' : (trendValue < 0 ? 'text-rose-400' : 'text-slate-400');
                  return (
                  <div key={i} className="flex items-center justify-between text-sm group p-2 hover:bg-slate-800/50 rounded-xl transition">
                    <div className="flex items-center gap-3 sm:gap-4 truncate pr-4">
                      <span className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-xs text-slate-400 shrink-0">
                        {i + 1}
                      </span>
                      {item.date && (
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md shrink-0 border border-slate-800">
                          {item.date}
                        </span>
                      )}
                      <span className="text-[10px] text-indigo-400 font-bold bg-indigo-900/20 px-1.5 py-0.5 rounded shrink-0 border border-indigo-500/20">
                        {keywordCount}x
                      </span>
                      <span className="text-slate-300 truncate group-hover:text-white transition">{item.keyword}</span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <svg width="32" height="12" viewBox="0 0 32 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={`opacity-70 hidden sm:block ${trendColor}`}>
                        <path d={getSparklinePath(item.keyword, selectedCategoryData.items)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-slate-100 font-medium w-16 sm:w-20 text-right">{item.volume.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
