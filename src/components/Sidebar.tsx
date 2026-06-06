import React from 'react';
import { LayoutDashboard, Layers, GraduationCap } from 'lucide-react';
import { useUI } from '../store';
import { ANALYZED_DATA, SUBJECT_META, UNIT_DESCRIPTIONS } from '../data/constants';
import { listUnits } from '../lib/frequency';

export const Sidebar: React.FC = () => {
  const { activeUnit, setActiveUnit } = useUI();
  const units = listUnits(ANALYZED_DATA);

  const NavButton: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    sub?: string;
  }> = ({ active, onClick, icon, label, sub }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
        active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <span className={active ? 'text-indigo-600 mt-0.5' : 'text-slate-400 mt-0.5'}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        {sub && <span className="block text-xs text-slate-400 truncate">{sub}</span>}
      </span>
    </button>
  );

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <GraduationCap size={18} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">LastMinBuddy</h1>
            <p className="text-[11px] text-slate-400 leading-tight">{SUBJECT_META.name}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <NavButton
          active={activeUnit === 'dashboard'}
          onClick={() => setActiveUnit('dashboard')}
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <div className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Units
        </div>
        {units.map((u) => (
          <NavButton
            key={u}
            active={activeUnit === u}
            onClick={() => setActiveUnit(u)}
            icon={<Layers size={18} />}
            label={`Unit ${u}`}
            sub={UNIT_DESCRIPTIONS[u]}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400">
        Study what matters. Answer for the marks.
      </div>
    </aside>
  );
};
