'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export function ProvinceSelect({ value, onChange, options }: {
  value: string; onChange: (val: string) => void; options: { label: string; value: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = options.find(o => o.value.toLowerCase() === value.toLowerCase() || o.label.toLowerCase() === value.toLowerCase());
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) || o.value.toLowerCase().includes(search.toLowerCase())
  );
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) { setSearch(''); setTimeout(() => searchRef.current?.focus(), 50); } }, [open]);
  if (options.length === 0) {
    return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Province / State"
      className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 bg-white placeholder:text-gray-300" />;
  }
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded px-2.5 py-1.5 text-sm bg-white hover:border-brand-navy focus:outline-none focus:border-brand-navy transition-colors">
        <span className={selected || value ? 'text-gray-800' : 'text-gray-300'}>{selected ? selected.label : value || 'Select province / state'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..." className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder-gray-400" />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0
              ? <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
              : filtered.map(o => (
                <li key={o.value} onMouseDown={() => { onChange(o.value); setOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${o.value.toLowerCase() === value.toLowerCase() ? 'bg-brand-navy text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <span className="font-mono text-xs opacity-60 w-6">{o.value}</span>
                  <span>{o.label}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
