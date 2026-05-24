import { Sparkles, Upload, RefreshCw } from 'lucide-react';

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

export default AppHeader;
