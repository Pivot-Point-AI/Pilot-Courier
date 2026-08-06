'use client';
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../_lib/constants';

// ── City autocomplete ─────────────────────────────────────────────────────────
export function CityInput({ value, onChange, country, placeholder = 'City', required }: {
  value: string;
  onChange: (val: string) => void;
  country: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSugg(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
      <input
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSugg(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50/60 focus:outline-none focus:border-[#1B2B6B] focus:bg-white focus:ring-2 focus:ring-[#1B2B6B]/10 transition-colors"
      />
      {showSugg && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 py-1 max-h-48 overflow-y-auto">
          {suggestions.map(city => (
            <li
              key={city}
              onMouseDown={() => { onChange(city); setShowSugg(false); }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
