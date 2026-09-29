'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';
import { ALL_COUNTRIES } from '../_lib/constants';

export function CountrySelect({ value, onChange, placeholder = 'Select country', className = '' }: {
  value: string; onChange: (code: string) => void; placeholder?: string; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  // Panel is rendered in a portal (see below) so an ancestor with overflow-x-auto — which forces
  // overflow-y to auto per the CSS spec — can't clip it. Position is tracked in viewport coordinates.
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = ALL_COUNTRIES.find(c => c.code === value);
  const filtered = ALL_COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { if (open) { setSearch(''); setTimeout(() => searchRef.current?.focus(), 50); } }, [open]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 220) });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button ref={btnRef} type="button" onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-1 border rounded px-2.5 py-1.5 text-sm bg-white hover:border-brand-navy focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 transition-colors ${open ? 'border-brand-navy ring-1 ring-brand-navy/20' : 'border-gray-300'}`}>
        <span className={`truncate min-w-0 ${selected ? 'text-gray-800' : 'text-gray-300'}`}>{selected ? selected.name : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && pos && createPortal(
        <div ref={panelRef} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }}
          className="z-50 min-w-[220px] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search country..." className="bg-transparent text-sm w-full focus:outline-none text-gray-700 placeholder-gray-400" />
            </div>
          </div>
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0
              ? <li className="px-3 py-2 text-sm text-gray-400 text-center">No results</li>
              : filtered.map(c => (
                <li key={c.code} onMouseDown={() => { onChange(c.code); setOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors ${c.code === value ? 'bg-brand-navy text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <span className="font-mono text-xs opacity-60 w-6">{c.code}</span>
                  <span>{c.name}</span>
                </li>
              ))}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}
