import { Filter, Search, AlertTriangle } from 'lucide-react';
import { DELIMITER_MAP } from '@/lib/utils';

const FilterPanel = ({ filterInclude, filterExclude, setFilterInclude, setFilterExclude, delimiter, setDelimiter }) => (
  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm mb-6">
    <div className="flex items-center gap-3 mb-6">
      <Filter className="h-5 w-5 text-indigo-400" />
      <h2 className="text-base font-semibold text-slate-100">Kriteria Filter Pencarian</h2>
    </div>
    
    <div className="grid gap-6 md:grid-cols-2">
      {/* Target Input */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          HARUS MENGANDUNG (TARGET):
        </label>
        <div className="relative">
          <input
            value={filterInclude}
            onChange={(event) => setFilterInclude(event.target.value)}
            placeholder="Contoh: sekolah, tas, murah"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 pl-4 pr-10 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition"
          />
          <Search className="absolute right-3 top-3 h-5 w-5 text-slate-500" />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Pisahkan dengan koma <span className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">,</span> untuk logika pencarian OR.
        </p>
      </div>

      {/* Exclude Input */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          KATA KUNCI SAMPAH (SINGKIRKAN):
        </label>
        <div className="relative">
          <input
            value={filterExclude}
            onChange={(event) => setFilterExclude(event.target.value)}
            placeholder="buku, bekas"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 pl-4 pr-10 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-rose-500 transition"
          />
          <AlertTriangle className="absolute right-3 top-3 h-5 w-5 text-slate-500" />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Kata kunci yang mengandung kata ini akan langsung dieliminasi secara otomatis.
        </p>
      </div>
    </div>
    
    {/* Delimiter Setting (Hidden/Minimal) */}
    <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-end gap-3 opacity-50 hover:opacity-100 transition-opacity">
      <span className="text-[10px] text-slate-400">Delimiter Data Mentah:</span>
      <div className="flex gap-1">
        {Object.keys(DELIMITER_MAP).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setDelimiter(option)}
            className={`rounded px-2 py-1 text-[10px] border ${delimiter === option ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
          >
            {option === 'comma' ? 'Koma (,)' : 'Titik-koma (;)'}
          </button>
        ))}
      </div>
    </div>
  </section>
);

export default FilterPanel;
