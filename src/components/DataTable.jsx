import { Database, Trash2, Copy, FileDown } from 'lucide-react';
import SectionCard from './SectionCard';

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

export default DataTable;
