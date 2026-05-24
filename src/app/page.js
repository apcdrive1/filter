"use client";

import { useMemo, useState } from 'react';
import { TrendingUp, X, Database, Filter as FilterIcon, Layers, Bookmark } from 'lucide-react';
import {
  INITIAL_DATA,
  DEFAULT_EXCLUDE,
  normalizeTerms,
  guessCategory,
  parseBulkText,
  copyRowsToClipboard,
  downloadCsv
} from '@/lib/utils';

import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import FilterPanel from '@/components/FilterPanel';
import RawDataSection from '@/components/RawDataSection';
import FilteredResultsSection from '@/components/FilteredResultsSection';
import Notification from '@/components/Notification';
import SavedListView from '@/components/SavedListView';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataMentah, setDataMentah] = useState(INITIAL_DATA);
  const [filterInclude, setFilterInclude] = useState('');
  const [filterExclude, setFilterExclude] = useState(DEFAULT_EXCLUDE);
  const [delimiter, setDelimiter] = useState('comma');
  const [bulkInput, setBulkInput] = useState('');
  const [savedLists, setSavedLists] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [toast, setToast] = useState('');

  const notify = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3000);
  };

  const includeTerms = useMemo(() => normalizeTerms(filterInclude), [filterInclude]);
  const excludeTerms = useMemo(() => normalizeTerms(filterExclude), [filterExclude]);

  const filteredData = useMemo(() => {
    const result = dataMentah.filter((item) => {
      const keyword = item.keyword.toLowerCase();
      const includeMatches = includeTerms.length === 0 || includeTerms.some((term) => keyword.includes(term));
      const excludeMatches = excludeTerms.length === 0 || !excludeTerms.some((term) => keyword.includes(term));
      return includeMatches && excludeMatches;
    });

    return [...result].sort((a, b) => b.volume - a.volume);
  }, [dataMentah, includeTerms, excludeTerms]);

  const groupedResults = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const category = guessCategory(item.keyword);
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [filteredData]);

  const handleBulkSubmit = () => {
    if (!bulkInput.trim()) {
      notify('Silakan masukkan data terlebih dahulu.');
      return;
    }

    const imported = parseBulkText(bulkInput, delimiter);
    if (imported.length === 0) {
      notify('Tidak ada data yang berhasil diproses.');
      return;
    }

    setDataMentah((prev) => [...imported, ...prev]);
    setBulkInput('');
    notify(`${imported.length} baris data berhasil ditambahkan.`);
  };

  const handleReset = () => {
    setDataMentah(INITIAL_DATA);
    setFilterInclude('');
    setFilterExclude(DEFAULT_EXCLUDE);
    notify('Data dikembalikan ke kondisi awal.');
  };

  const handleRemoveRow = (index) => {
    setDataMentah((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearAllRaw = () => {
    setDataMentah([]);
    notify('Semua data mentah telah dihapus.');
  };

  const handleAppendToSavedList = (existingList) => {
    if (filteredData.length === 0) {
      notify('Tidak ada hasil untuk disimpan.');
      return;
    }

    setSavedLists(prev => prev.map(list => {
      if (list.id === existingList.id) {
        const existingKeys = new Set(list.items.map(item => `${item.keyword}|${item.date}`));
        const newItems = filteredData.filter(item => !existingKeys.has(`${item.keyword}|${item.date}`));
        return {
          ...list,
          items: [...list.items, ...newItems]
        };
      }
      return list;
    }));

    setNewListName('');
    setShowSaveModal(false);
    notify(`Data berhasil ditambahkan ke "${existingList.name}".`);
  };

  const handleSaveCurrentList = () => {
    if (!newListName.trim()) {
      notify('Nama daftar harus diisi.');
      return;
    }

    if (filteredData.length === 0) {
      notify('Tidak ada hasil untuk disimpan.');
      return;
    }

    const existingExact = savedLists.find(l => l.name.toLowerCase() === newListName.trim().toLowerCase());
    if (existingExact) {
      handleAppendToSavedList(existingExact);
      return;
    }

    const newList = {
      id: Date.now(),
      name: newListName,
      createdAt: new Date().toISOString().slice(0, 10),
      items: filteredData
    };

    setSavedLists((prev) => [newList, ...prev]);
    setNewListName('');
    setShowSaveModal(false);
    notify('Daftar berhasil disimpan.');
  };

  const handleLoadSavedList = (list) => {
    setDataMentah(list.items);
    setFilterInclude('');
    setFilterExclude(DEFAULT_EXCLUDE);
    setActiveTab('dashboard');
    notify(`Daftar "${list.name}" berhasil dimuat ke dashboard.`);
  };

  const handleDeleteSavedList = (id) => {
    setSavedLists((prev) => prev.filter(list => list.id !== id));
    notify('Daftar berhasil dihapus.');
  };

  const handleDeleteGroupFromList = (listId, categoryName) => {
    setSavedLists(prev => prev.map(list => {
      if (list.id === listId) {
        const newItems = list.items.filter(item => guessCategory(item.keyword) !== categoryName);
        return { ...list, items: newItems };
      }
      return list;
    }).filter(list => list.items.length > 0));
    notify(`Grup "${categoryName}" berhasil dihapus.`);
  };

  const handleCopySavedList = (items) => {
    copyRowsToClipboard(items, notify);
  };

  const handleDownloadSavedList = (items, name) => {
    downloadCsv(items, `koleksi_${name.toLowerCase().replace(/\\s+/g, '_')}`, notify);
  };

  const totalVolume = filteredData.reduce((sum, item) => sum + item.volume, 0);
  const efficiency = dataMentah.length > 0 ? Math.round((filteredData.length / dataMentah.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} savedCount={savedLists.length} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AppHeader
          title="Dashboard Cleaner"
          onOpenBulk={() => {
            // Focus on bulk text area or do something else if needed
            document.querySelector('textarea')?.focus();
          }}
          onReset={handleReset}
        />

        {activeTab === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24">
            <div className="max-w-[1600px] mx-auto space-y-6">
              
              {/* Top Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">TOTAL DATA MENTAH</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-slate-100">{dataMentah.length}</span>
                      <span className="text-sm text-slate-400 mb-1">Keyword</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <Database className="h-10 w-10 text-indigo-500/10 absolute right-4 bottom-4" />
                    <span className="relative z-10">Volume total: {dataMentah.reduce((sum, item) => sum + item.volume, 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">HASIL TERFILTER</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-emerald-400">{filteredData.length}</span>
                      <span className="text-sm text-slate-400 mb-1">Keyword</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <FilterIcon className="h-10 w-10 text-emerald-500/10 absolute right-4 bottom-4" />
                    <span className="relative z-10">Lolos seleksi filter Anda</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1">PENCARIAN TERJAGA (VOLUME)</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-cyan-400">{totalVolume.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <TrendingUp className="h-10 w-10 text-cyan-500/10 absolute right-4 bottom-4" />
                    <span className="relative z-10">Dari total {dataMentah.reduce((sum, item) => sum + item.volume, 0).toLocaleString('id-ID')} pencarian</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">EFISIENSI FILTER</h3>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-purple-400">{efficiency}%</span>
                      <span className="text-sm text-slate-400 mb-1">Tersimpan</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 relative">
                    <Layers className="h-10 w-10 text-purple-500/10 absolute right-0 -top-8" />
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${efficiency}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row: Filter Panel */}
              <FilterPanel
                filterInclude={filterInclude}
                filterExclude={filterExclude}
                setFilterInclude={setFilterInclude}
                setFilterExclude={setFilterExclude}
                delimiter={delimiter}
                setDelimiter={setDelimiter}
              />

              {/* Bottom Row: 2 Column Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                <RawDataSection
                  dataMentah={dataMentah}
                  onRemove={handleRemoveRow}
                  bulkInput={bulkInput}
                  setBulkInput={setBulkInput}
                  onBulkSubmit={handleBulkSubmit}
                  onClearAll={handleClearAllRaw}
                />
                <FilteredResultsSection
                  filteredData={filteredData}
                  groupedResults={groupedResults}
                  onSave={() => setShowSaveModal(true)}
                  onCopy={(rows) => copyRowsToClipboard(rows, notify)}
                  onExport={(rows) => downloadCsv(rows, 'hasil_filter', notify)}
                  filterInclude={filterInclude}
                  filterExclude={filterExclude}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedListView
            savedLists={savedLists}
            onLoadToDashboard={handleLoadSavedList}
            onCopy={handleCopySavedList}
            onDownload={handleDownloadSavedList}
            onDelete={handleDeleteSavedList}
            onDeleteGroup={handleDeleteGroupFromList}
          />
        )}
      </main>

      {/* Modals */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Simpan Daftar Hasil</h3>
                <p className="text-xs text-slate-500">Berikan nama ringkas untuk daftar filter Anda.</p>
              </div>
              <button onClick={() => setShowSaveModal(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              value={newListName}
              onChange={(event) => setNewListName(event.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              placeholder="Nama daftar misalnya: Riset Sepatu Sekolah"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCurrentList();
              }}
            />

            {/* Suggestions */}
            {savedLists.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                  {newListName.trim() ? 'SARAN PENYIMPANAN' : 'PENYIMPANAN TERAKHIR'}
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {savedLists
                    .filter(list => !newListName.trim() || list.name.toLowerCase().includes(newListName.trim().toLowerCase()))
                    .slice(0, 5)
                    .map(list => (
                      <button
                        key={list.id}
                        onClick={() => handleAppendToSavedList(list)}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 border border-transparent hover:border-indigo-500/30 transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Bookmark className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400" />
                          <span className="truncate max-w-[200px] sm:max-w-[300px]">{list.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full group-hover:bg-indigo-950 group-hover:text-indigo-300 shrink-0">
                          {list.items.length} item
                        </span>
                      </button>
                    ))
                  }
                  {newListName.trim() && savedLists.filter(list => list.name.toLowerCase().includes(newListName.trim().toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-xs text-slate-500 italic">
                      Penyimpanan baru akan dibuat.
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowSaveModal(false)} className="rounded-2xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition">Batal</button>
              <button onClick={handleSaveCurrentList} className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <Notification message={toast} />
    </div>
  );
}
