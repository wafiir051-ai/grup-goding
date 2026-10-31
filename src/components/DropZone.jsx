import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function DropZone({ onFiles, accept, multiple = false, hint, disabled = false, children }) {
  const [dragging, setDragging] = useState(false);

  const handle = (list) => {
    const files = Array.from(list || []);
    if (files.length && !disabled) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer text-zinc-300 transition-colors ${dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-zinc-700 hover:border-cyan-500'} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <Upload size={24} />
      <span className="font-semibold text-sm text-center">{dragging ? 'Lepaskan di sini' : 'Seret file dari Finder ke sini, atau klik untuk memilih'}</span>
      {hint && <span className="text-xs text-zinc-500 text-center">{hint}</span>}
      {children}
      <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => { handle(e.target.files); e.target.value = ''; }} />
    </label>
  );
}
