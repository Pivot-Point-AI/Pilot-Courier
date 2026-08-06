'use client';
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../_lib/constants';

export function CityInput({ value, onChange, country }: { value: string; onChange: (val: string) => void; country: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowSugg(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const handleInput = async (val: string) => {
    onChange(val);
    if (val.length < 2) { setShowSugg(false); return; }
    try {
      const r = await fetch(`${API_URL}/geo/cities?country=${country}&q=${encodeURIComponent(val)}`);
      const data = await r.json();
      const cities: string[] = Array.isArray(data) ? data.map((d: any) => typeof d === 'string' ? d : d.label || d) : [];
      setSuggestions(cities.slice(0, 8));
      setShowSugg(cities.length > 0);
    } catch { setShowSugg(false); }
  };
  return (
    <div className="relative" ref={ref}>
      <input type="text" value={value} onChange={e => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSugg(true)}
        placeholder="City" autoComplete="off"
        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 bg-white placeholder:text-gray-300" />
      {showSugg && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 py-1 max-h-48 overflow-y-auto">
          {suggestions.map(city => (
            <li key={city} onMouseDown={() => { onChange(city); setShowSugg(false); }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">{city}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
