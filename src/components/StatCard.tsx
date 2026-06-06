import React from 'react';

export const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</h3>
    <div className="text-3xl font-bold text-slate-800">{value}</div>
  </div>
);
