import { Upload, X } from 'lucide-react';

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

export default BulkImportModal;
