import { Search } from 'lucide-react';

export function SearchBox({
  value,
  onChange,
  placeholder = 'Buscar…',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block min-w-0">
      <span className="sr-only">{placeholder}</span>
      <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
      <input
        className="field pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
