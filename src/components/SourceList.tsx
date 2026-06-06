import React from 'react';
import { Globe, Flame } from 'lucide-react';
import { Source } from '../types';

export const SourceList: React.FC<{ sources: Source[] }> = ({ sources }) => {
  if (!sources?.length) return null;
  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
        <Globe size={14} className="text-indigo-500" />
        Sources &amp; References
      </h4>
      <ul className="space-y-2">
        {sources.map((s, i) => (
          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-slate-400 select-none">[{i + 1}]</span>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 hover:underline transition-colors"
            >
              {s.title}
            </a>
            {s.match_type === 'exact' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">
                <Flame size={11} /> Exact Solution Found
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
