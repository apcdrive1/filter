import React, { useMemo, useState } from 'react';
import {
  FileDown,
  Copy,
  Trash2,
  Plus,
  Upload,
  Search,
  AlertTriangle,
  RefreshCw,
  Database,
  Filter,
  Sparkles,
  X,
  LayoutDashboard,
  Bookmark,
  Settings as SettingsIcon,
  Menu,
  ChevronRight,
  Save,
  HelpCircle,
  Table,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from 'lucide-react';

const INITIAL_DATA = [
  { date: '2025-11-10', keyword: 'sarung celana sholat pria', volume: 19398 },
  { date: '2025-11-17', keyword: 'sarung celana sholat pria', volume: 21089 },
  { date: '2025-11-20', keyword: 'sarung celana sholat pria', volume: 21398 },
  { date: '2025-11-27', keyword: 'sarung celana sholat pria', volume: 21875 },
  { date: '2026-01-01', keyword: 'sarung celana sholat pria', volume: 34927 },
  { date: '2025-11-10', keyword: 'sarung wadimor batik terbaru 2025', volume: 9059 },
  { date: '2025-11-14', keyword: 'sarung wadimor batik terbaru 2025', volume: 9535 },
  { date: '2025-11-17', keyword: 'sarung wadimor batik terbaru 2025', volume: 9983 },
  { date: '2025-11-23', keyword: 'sarung wadimor batik terbaru 2025', volume: 10457 },
  { date: '2026-01-01', keyword: 'sarung wadimor batik terbaru 2025', volume: 15626 },
  { date: '2025-11-10', keyword: 'sarung celana dewasaa', volume: 8176 },
  { date: '2025-11-17', keyword: 'sarung celana dewasaa', volume: 8927 },
  { date: '2025-11-20', keyword: 'sarung celana dewasaa', volume: 8886 },
  { date: '2025-11-27', keyword: 'sarung celana dewasaa', volume: 8511 },
  { date: '2025-12-10', keyword: 'sarung celana dewasaa', volume: 9712 },
  { date: '2025-12-13', keyword: 'sarung celana dewasaa', volume: 9667 },
  { date: '2025-11-12', keyword: 'baju koko kurta modern', volume: 14500 },
  { date: '2025-11-15', keyword: 'hijab pashmina ceruty premium', volume: 28900 },
  { date: '2025-10-31', keyword: 'sarung bantal murah 10 pcs', volume: 13171 },
  { date: '2025-11-17', keyword: 'sarung bantal murah 10 pcs', volume: 54170 },
  { date: '2025-11-23', keyword: 'sarung bantal murah 10 pcs', volume: 73689 },
  { date: '2025-11-27', keyword: 'sarung bantal murah 10 pcs', volume: 83220 },
  { date: '2025-11-18', keyword: 'sprei kasur kintakun minimalis', volume: 19800 },
  { date: '2025-11-22', keyword: 'sofa minimalis ruang tamu keluarga', volume: 32000 },
  { date: '2025-11-10', keyword: 'tas ransel laptop anti air', volume: 45200 },
  { date: '2025-11-14', keyword: 'tas selempang kulit pria', volume: 18900 },
  { date: '2025-11-20', keyword: 'tas wanita kondangan mewah', volume: 27100 },
  { date: '2025-11-23', keyword: 'tas sekolah anak laki laki sd', volume: 624964 },
  { date: '2025-11-23', keyword: 'tas sekolah anak perempuan sd', volume: 290216 },
  { date: '2025-11-23', keyword: 'tas sekolah anak laki laki tk', volume: 208831 },
  { date: '2025-11-23', keyword: 'tas sekolah anak perempuan tk', volume: 171727 },
  { date: '2025-11-23', keyword: 'tas anak sekolah sd laki laki', volume: 57021 },
  { date: '2025-11-05', keyword: 'sepatu running specs original', volume: 31200 },
  { date: '2025-11-09', keyword: 'sandal gunung anti slip', volume: 15400 },
  { date: '2025-11-15', keyword: 'sepatu sneaker pria lokal', volume: 23600 }
];

const DEFAULT_EXCLUDE = 'buku, bekas';
const DELIMITER_MAP = { comma: ',', semicolon: ';' };

const CATEGORIES = [
  { name: 'Tas', terms: ['tas', 'ransel', 'selempang', 'dompet'] },
  { name: 'Pakaian & Ibadah', terms: ['sarung', 'celana', 'wadimor', 'baju', 'hijab', 'koko'] },
  { name: 'Perlengkapan Rumah', terms: ['bantal', 'sofa', 'kasur', 'sprei'] },
  { name: 'Sepatu & Sandal', terms: ['sepatu', 'sandal', 'sneaker'] }
];

const trimAndSplit = (value, separator = ',') =>
  value
    .split(separator)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const normalizeTerms = (value) => trimAndSplit(value, ',');

const guessCategory = (keyword) => {
  const lower = keyword.toLowerCase();
  const matched = CATEGORIES.find((category) =>
    category.terms.some((term) => lower.includes(term))
  );
  return matched ? matched.name : 'Lain-lain';
};

const parseRow = (line, delimiter) => {
  const fields = line
    .split(/\t|,|;/)
    .map((field) => field.trim())
    .filter(Boolean);

  if (fields.length === 0) return null;
  if (fields.length === 1) {
    return { date: new Date().toISOString().slice(0, 10), keyword: fields[0], volume: 0 };
  }
  if (fields.length === 2) {
    const [first, second] = fields;
    if (/^\d{4}-\d{2}-\d{2}$/.test(first)) {
      return { date: first, keyword: second, volume: 0 };
    }
    return { date: new Date().toISOString().slice(0, 10), keyword: first, volume: parseInt(second.replace(/[^0-9]/g, ''), 10) || 0 };
  }

  return {
    date: fields[0],
    keyword: fields[1],
    volume: parseInt(fields[2].replace(/[^0-9]/g, ''), 10) || 0
  };
};

const parseBulkText = (rawText, delimiterType) => {
  const delimiter = DELIMITER_MAP[delimiterType] || ',';
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseRow(line, delimiter))
    .filter(Boolean);
};

const buildCsv = (rows) => {
  const header = 'Tanggal,Kata Kunci,Volume';
  const body = rows
    .map((row) => `"${row.date}","${row.keyword.replace(/"/g, '""')}",${row.volume}`)
    .join('\n');
  return `${header}\n${body}`;
};

const copyRowsToClipboard = async (rows, notify) => {
  if (rows.length === 0) {
    notify('Tidak ada data untuk disalin.');
    return;
  }

  const content = rows.map((row) => `${row.date}\t${row.keyword}\t${row.volume}`).join('\n');

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(content);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    notify('Data disalin ke clipboard.');
  } catch (error) {
    notify('Gagal menyalin clipboard.');
  }
};

const downloadCsv = (rows, filename, notify) => {
  if (rows.length === 0) {
    notify('Tidak ada data untuk diunduh.');
    return;
  }

  const csv = buildCsv(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
  notify('CSV berhasil diunduh.');
};

const AppHeader = ({ title, onOpenBulk, onReset }) => (
  <header className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/90">
    <div className="flex items-center gap-3">
      <Sparkles className="h-6 w-6 text-indigo-400" />
      <div>
        <h1 className="text-lg font-semibold text-white">Filter Kata Kunci</h1>
        <p className="text-xs text-slate-400">Saring, simpan, dan ekspor data kata kunci Anda dengan cepat.</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onOpenBulk} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs hover:bg-indigo-500 transition">
        <Upload className="h-4 w-4" /> Import
      </button>
      <button onClick={onReset} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 transition text-xs">
        <RefreshCw className="h-4 w-4" /> Reset
      </button>
    </div>
  </header>
);

const SectionCard = ({ title, icon, children }) => (
  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
    </div>
    {children}
  </section>
);

const Sidebar = ({ activeTab, onChangeTab, savedCount }) => (
  <aside className="w-full max-w-[260px] border-r border-slate-800 bg-slate-950/95 p-4 hidden lg:block">
    <div className="space-y-4">
      <div className="border border-slate-800 rounded-3xl p-4 bg-slate-900">
        <h2 className="text-sm font-bold text-white">Menu Utama</h2>
        <p className="text-xs text-slate-500 mt-1">Pilih area kerja untuk melihat hasil atau koleksi.</p>
      </div>
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
            className={`w-full flex items-center justify-between gap-3 p-3 rounded-2xl text-left transition ${activeTab === item.key ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-900'}`}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              {item.label}
            </span>
            {item.badge ? <span className="text-[10px] bg-slate-800 px-2 py-1 rounded-full">{item.badge}</span> : <ChevronRight className="h-4 w-4" />}
          </button>
        );
      })}
    </div>
  </aside>
);

const FilterPanel = ({ filterInclude, filterExclude, setFilterInclude, setFilterExclude, delimiter, setDelimiter }) => (
  <SectionCard
    title="Kriteria Filter"
    icon={<Filter className="h-5 w-5 text-emerald-400" />}
  >
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Kata Kunci Target</label>
        <input
          value={filterInclude}
          onChange={(event) => setFilterInclude(event.target.value)}
          placeholder="pisahkan dengan koma: tas, sepatu, sofa"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Kata Kunci Dibuang</label>
        <input
          value={filterExclude}
          onChange={(event) => setFilterExclude(event.target.value)}
          placeholder="buku, bekas, kaskus"
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-rose-500"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-slate-300 mb-2">Delimiter Impor Data</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(DELIMITER_MAP).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDelimiter(option)}
              className={`rounded-full px-4 py-2 text-xs border ${delimiter === option ? 'border-emerald-500 bg-emerald-600/10 text-emerald-300' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}
            >
              {option === 'comma' ? 'Koma (,)' : 'Titik-koma (;)'}
            </button>
          ))}
        </div>
      </div>
    </div>
  </SectionCard>
);

const DataTable = ({ rows, onRemove, onCopy, onExport }) => (
  <SectionCard
    title={`Hasil Filter (${rows.length})`}
    icon={<Database className="h-5 w-5 text-indigo-400" />}
  >
    <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-[0.15em]">
          <tr>
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Kata Kunci</th>
            <th className="px-4 py-3 text-right">Volume</th>
            <th className="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, index) => (
            <tr key={`${row.keyword}-${index}`} className="hover:bg-slate-900/50 transition-colors">
              <td className="px-4 py-3 text-slate-300 text-[13px] font-mono">{row.date}</td>
              <td className="px-4 py-3 text-slate-100">{row.keyword}</td>
              <td className="px-4 py-3 text-right text-emerald-300 font-semibold">{row.volume.toLocaleString('id-ID')}</td>
              <td className="px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="inline-flex items-center justify-center rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onCopy(rows)}
        className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2 text-xs text-slate-100 hover:bg-slate-700 transition"
      >
        <Copy className="h-4 w-4" /> Salin
      </button>
      <button
        type="button"
        onClick={() => onExport(rows)}
        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs text-white hover:bg-emerald-500 transition"
      >
        <FileDown className="h-4 w-4" /> Unduh CSV
      </button>
    </div>
  </SectionCard>
);

const BulkImportModal = ({ open, rawText, onClose, onChange, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Import Data Mentah</h3>
              <p className="text-xs text-slate-500">Tempel data Excel / Google Sheets di bawah.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">
          <textarea
            rows={10}
            value={rawText}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            placeholder="Contoh: 2026-05-23\ttas sekolah anak\t624964"
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
          <button onClick={onClose} className="rounded-2xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition">Batal</button>
          <button onClick={onSubmit} className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs text-white hover:bg-indigo-500 transition">Tambahkan</button>
        </div>
      </div>
    </div>
  );
};

const Notification = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-3xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm text-white shadow-lg shadow-slate-950/40">
      {message}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataMentah, setDataMentah] = useState(INITIAL_DATA);
  const [filterInclude, setFilterInclude] = useState('');
  const [filterExclude, setFilterExclude] = useState(DEFAULT_EXCLUDE);
  const [delimiter, setDelimiter] = useState('comma');
  const [autoSort, setAutoSort] = useState(true);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
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

    if (autoSort) {
      return [...result].sort((a, b) => b.volume - a.volume);
    }

    return result;
  }, [dataMentah, includeTerms, excludeTerms, autoSort]);

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
    setShowBulkModal(false);
    notify(`${imported.length} baris data berhasil ditambahkan.`);
  };

  const handleReset = () => {
    setDataMentah(INITIAL_DATA);
    setFilterInclude('');
    setFilterExclude(DEFAULT_EXCLUDE);
    setAutoSort(true);
    notify('Data dikembalikan ke kondisi awal.');
  };

  const handleRemoveRow = (index) => {
    setDataMentah((prev) => prev.filter((_, idx) => idx !== index));
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

  const currentSavedCount = savedLists.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-[1480px] px-4 py-4 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <Sidebar activeTab={activeTab} onChangeTab={setActiveTab} savedCount={currentSavedCount} />

          <main className="space-y-6">
            <AppHeader
              title="Dashboard"
              onOpenBulk={() => setShowBulkModal(true)}
              onReset={handleReset}
            />

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <FilterPanel
                  filterInclude={filterInclude}
                  filterExclude={filterExclude}
                  setFilterInclude={setFilterInclude}
                  setFilterExclude={setFilterExclude}
                  delimiter={delimiter}
                  setDelimiter={setDelimiter}
                />

                <DataTable
                  rows={filteredData}
                  onRemove={handleRemoveRow}
                  onCopy={(rows) => copyRowsToClipboard(rows, notify)}
                  onExport={(rows) => downloadCsv(rows, 'hasil_filter', notify)}
                />
              </div>

              <div className="space-y-6">
                <SectionCard
                  title="Ringkasan"
                  icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Data Asli</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{dataMentah.length}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Hasil Filter</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{filteredData.length}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-slate-400">
                    <p>Kategori utama:
                      {Object.entries(groupedResults).map(([category, items]) => (
                        <span key={category} className="inline-block ml-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px]">{category} ({items.length})</span>
                      ))}
                    </p>
                  </div>
                </SectionCard>

                <SectionCard title="Daftar Tersimpan" icon={<Bookmark className="h-5 w-5 text-indigo-400" />}>
                  {savedLists.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-6 text-sm text-slate-500 text-center">
                      Belum ada daftar tersimpan. Simpan hasil filter Anda untuk melihatnya di sini.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedLists.slice(0, 3).map((list) => (
                        <div key={list.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-semibold text-white">{list.name}</h3>
                              <p className="text-xs text-slate-500">Disimpan: {list.createdAt}</p>
                            </div>
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">{list.items.length} baris</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </div>
            </div>
          </main>
        </div>
      </div>

      <BulkImportModal
        open={showBulkModal}
        rawText={bulkInput}
        onClose={() => setShowBulkModal(false)}
        onChange={setBulkInput}
        onSubmit={handleBulkSubmit}
      />

      {showSaveModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-4">
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
            />
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowSaveModal(false)} className="rounded-2xl border border-slate-700 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 transition">Batal</button>
              <button onClick={handleSaveCurrentList} className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs text-white hover:bg-indigo-500 transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      <Notification message={toast} />
    </div>
  );
}
