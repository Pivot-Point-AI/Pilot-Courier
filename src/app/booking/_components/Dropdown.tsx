'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type DropdownOption<T> = { value: T; label: string };

// Styled single-select (button + listbox). Used where the native <select> popup looks out of place or runs
// off-screen (e.g. 100 quantities). Keyboard: arrows, PageUp/PageDown, Home/End, Enter/Space, Esc, type-ahead.
export function Dropdown<T extends string | number>({ value, options, onChange, label, className = '' }: {
  value: T; options: DropdownOption<T>[]; onChange: (v: T) => void; label: string; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const justOpened = useRef(false);
  const typeahead = useRef({ buf: '', at: 0 });
  const id = useId();
  const selectedIdx = Math.max(0, options.findIndex(o => o.value === value));

  const openList = (at = selectedIdx) => { justOpened.current = true; setActive(at); setOpen(true); };
  const choose = (i: number) => { setOpen(false); if (options[i].value !== value) onChange(options[i].value); };

  // Index of the first option whose label starts with the keys typed in quick succession ("1","2" → 12)
  const match = (key: string) => {
    const t = typeahead.current, now = Date.now();
    t.buf = (now - t.at < 700 ? t.buf : '') + key.toLowerCase(); t.at = now;
    const find = (q: string) => options.findIndex(o => o.label.toLowerCase().startsWith(q));
    const i = find(t.buf);
    if (i >= 0 || t.buf.length === 1) return i;
    t.buf = key.toLowerCase();
    return find(t.buf);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // Center the selection when the list opens, then keep the highlighted option in view.
  // Scrolls the list only — scrollIntoView would also scroll the page.
  useEffect(() => {
    const list = listRef.current;
    const el = list?.children[active] as HTMLElement | undefined;
    if (!open || !list || !el) return;
    if (justOpened.current) {
      justOpened.current = false;
      list.scrollTop = el.offsetTop - (list.clientHeight - el.offsetHeight) / 2;
    } else if (el.offsetTop < list.scrollTop) {
      list.scrollTop = el.offsetTop;
    } else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
    }
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const move = (i: number) => { e.preventDefault(); setActive(Math.min(last, Math.max(0, i))); };
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList(); }
      else if (e.key.length === 1) { const i = match(e.key); if (i >= 0) openList(i); }
      return;
    }
    switch (e.key) {
      case 'ArrowDown': return move(active + 1);
      case 'ArrowUp': return move(active - 1);
      case 'PageDown': return move(active + 10);
      case 'PageUp': return move(active - 10);
      case 'Home': return move(0);
      case 'End': return move(last);
      case 'Enter': case ' ': e.preventDefault(); return choose(active);
      case 'Escape': e.preventDefault(); return setOpen(false);
      case 'Tab': return setOpen(false);
      default:
        if (e.key.length === 1) { const i = match(e.key); if (i >= 0) setActive(i); }
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`w-full h-8 flex items-center justify-between gap-2 border rounded-md pl-2.5 pr-2 text-xs font-medium text-gray-700 bg-white tabular-nums focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20 transition-colors ${
          open ? 'border-brand-navy ring-1 ring-brand-navy/20' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <span className="truncate">{options[selectedIdx]?.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full mt-1 z-30 min-w-full max-h-60 overflow-y-auto overscroll-contain py-1 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          {options.map((o, i) => {
            const selected = i === selectedIdx;
            return (
              <li
                key={String(o.value)}
                id={`${id}-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={e => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex items-center justify-between gap-3 px-2.5 py-1.5 text-xs whitespace-nowrap tabular-nums cursor-pointer select-none ${
                  i === active ? 'bg-gray-100' : ''
                } ${selected ? 'font-semibold text-brand-navy' : 'text-gray-700'}`}
              >
                {o.label}
                <Check className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? '' : 'invisible'}`} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
