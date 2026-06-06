import React from 'react';
import { BookX } from 'lucide-react';
import { SYLLABUS_MISSING_TOPICS } from '../data/constants';

export const SyllabusGaps: React.FC<{ unit: number }> = ({ unit }) => {
  const gaps = SYLLABUS_MISSING_TOPICS[unit];
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-200">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
            <BookX size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Syllabus Gaps</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          These topics are in the Unit {unit} syllabus but have <strong>not</strong> appeared in the
          analyzed papers — likely blind spots worth a quick pass.
        </p>
        <ul className="space-y-2">
          {gaps.map((g, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
