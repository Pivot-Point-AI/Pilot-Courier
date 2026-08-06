'use client';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

// ── Province Select ───────────────────────────────────────────────────────────
export function ProvinceSelect({ value, onChange, options, placeholder = 'Select province / state' }: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find(o => o.value.toLowerCase() === value.toLowerCase() || o.label.toLowerCase() === value.toLowerCase());
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.value.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) { setSearch(''); setTimeout(() => searchRef.current?.focus(), 50); }
  }, [open]);

  if (options.length === 0) {
    return (
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Province / State"
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
      />
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 hover:border-[#1B2B6B] focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
      >
        <span className={selected || value ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.label : value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
            ) : filtered.map(o => (
              <li
                key={o.value}
                onMouseDown={() => { onChange(o.value); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${
                  o.value.toLowerCase() === value.toLowerCase() ? 'bg-[#1B2B6B] text-white' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
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
