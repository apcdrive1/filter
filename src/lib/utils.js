export const INITIAL_DATA = [
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

export const DEFAULT_EXCLUDE = 'buku, bekas';
export const DELIMITER_MAP = { comma: ',', semicolon: ';' };

export const CATEGORIES = [
  { name: 'Tas', terms: ['tas', 'ransel', 'selempang', 'dompet'] },
  { name: 'Pakaian & Ibadah', terms: ['sarung', 'celana', 'wadimor', 'baju', 'hijab', 'koko'] },
  { name: 'Perlengkapan Rumah', terms: ['bantal', 'sofa', 'kasur', 'sprei'] },
  { name: 'Sepatu & Sandal', terms: ['sepatu', 'sandal', 'sneaker'] }
];

export const trimAndSplit = (value, separator = ',') =>
  value
    .split(separator)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const normalizeTerms = (value) => trimAndSplit(value, ',');

export const guessCategory = (keyword) => {
  const lower = keyword.toLowerCase();
  const matched = CATEGORIES.find((category) =>
    category.terms.some((term) => lower.includes(term))
  );
  return matched ? matched.name : 'Lain-lain';
};

export const parseRow = (line, delimiter) => {
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

export const parseBulkText = (rawText, delimiterType) => {
  const delimiter = DELIMITER_MAP[delimiterType] || ',';
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseRow(line, delimiter))
    .filter(Boolean);
};

export const buildCsv = (rows) => {
  const header = 'Tanggal,Kata Kunci,Volume';
  const body = rows
    .map((row) => `"${row.date}","${row.keyword.replace(/"/g, '""')}",${row.volume}`)
    .join('\n');
  return `${header}\n${body}`;
};

export const copyRowsToClipboard = async (rows, notify) => {
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

export const downloadCsv = (rows, filename, notify) => {
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
