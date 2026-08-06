import { STEPS } from '../_lib/constants';

export function StepBar({ current }: { current: number }) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex">
          {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div key={label} className="flex-1 flex items-center gap-0">
                <div className={`py-3 px-2 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all w-full justify-center ${active ? 'border-brand-orange text-brand-navy' : done ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${active ? 'bg-brand-orange text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className="hidden sm:block">{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
