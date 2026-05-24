import { Trash2, Plus, Database } from 'lucide-react';
import SectionCard from './SectionCard';

const RawDataSection = ({ 
  dataMentah, 
  onRemove, 
  bulkInput, 
  setBulkInput, 
  onBulkSubmit,
  onClearAll 
}) => {
  return (
    <SectionCard
      title={`Data Mentah Scraping`}
      badge={dataMentah.length}
    >
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-slate-300">
            Tempel data dari excel/scraper:
          </label>
          <span className="text-[10px] text-slate-500 italic">Format: Tanggal [Tab] Keyword [Tab] Volume</span>
        </div>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="Contoh salinan Excel:&#10;2026-05-23&#9;tas sekolah anak&#9;1212697&#10;2026-05-23&#9;sepatu sekolah tk&#9;92800"
          className="w-full h-32 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-indigo-500 font-mono resize-none mb-4"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/50 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <Trash2 className="h-4 w-4" /> Hapus Semua
          </button>
          <button
            onClick={onBulkSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
          >
            <Plus className="h-4 w-4" /> Proses Tempel Data
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-left text-sm relative">
          <thead className="sticky top-0 bg-slate-900 text-slate-400 text-[11px] uppercase tracking-[0.15em] z-10">
            <tr>
              <th className="px-4 py-3 border-b border-slate-800">Tanggal</th>
              <th className="px-4 py-3 border-b border-slate-800">Kata Pencarian</th>
              <th className="px-4 py-3 border-b border-slate-800 text-right">Volume</th>
              <th className="px-4 py-3 border-b border-slate-800 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {dataMentah.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-slate-500 text-xs">Belum ada data mentah.</td>
              </tr>
            ) : (
              dataMentah.map((row, index) => (
                <tr key={`${row.keyword}-${index}`} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-[12px] font-mono whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3 text-slate-200">{row.keyword}</td>
                  <td className="px-4 py-3 text-right text-slate-300 font-semibold">{row.volume.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRemove(index)}
                      className="inline-flex items-center justify-center rounded-full p-2 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
};

export default RawDataSection;
