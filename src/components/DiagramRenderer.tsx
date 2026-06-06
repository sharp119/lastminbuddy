import React, { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Visual } from '../types';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];

let mermaidReady = false;
function initMermaid() {
  if (!mermaidReady) {
    mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
    mermaidReady = true;
  }
}

const MermaidView: React.FC<{ code: string }> = ({ code }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [err, setErr] = useState(false);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');

  useEffect(() => {
    let cancelled = false;
    initMermaid();
    mermaid
      .render(`mmd${rawId}`, code)
      .then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch(() => setErr(true));
    return () => {
      cancelled = true;
    };
  }, [code, rawId]);

  if (err)
    return <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded-lg overflow-x-auto">{code}</pre>;
  return <div ref={ref} className="mermaid-svg flex justify-center" />;
};

const RechartsView: React.FC<{ data: string }> = ({ data }) => {
  let cfg: any;
  try {
    cfg = JSON.parse(data);
  } catch {
    return <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded-lg overflow-x-auto">{data}</pre>;
  }
  const rows = cfg.data || [];
  const series = cfg.series || [];
  const xKey = cfg.xAxisKey || 'name';
  const type = cfg.type || 'LineChart';
  const Chart: any = type === 'BarChart' ? BarChart : type === 'AreaChart' ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <Chart data={rows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
        <XAxis dataKey={xKey} style={{ fontSize: 12 }} />
        <YAxis style={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {series.map((s: any, i: number) => {
          const color = s.color || COLORS[i % COLORS.length];
          if (type === 'BarChart') return <Bar key={i} dataKey={s.dataKey} name={s.name} fill={color} radius={[4, 4, 0, 0]} />;
          if (type === 'AreaChart')
            return <Area key={i} dataKey={s.dataKey} name={s.name} stroke={color} fill={color} fillOpacity={0.2} />;
          return <Line key={i} dataKey={s.dataKey} name={s.name} stroke={color} dot={false} strokeWidth={2} />;
        })}
      </Chart>
    </ResponsiveContainer>
  );
};

const FlowView: React.FC<{ data: string }> = ({ data }) => {
  let arr: any[];
  try {
    arr = JSON.parse(data);
  } catch {
    return <pre className="bg-slate-900 text-slate-100 text-xs p-4 rounded-lg overflow-x-auto">{data}</pre>;
  }
  const nodes = arr.filter((n) => n.id);
  const edges = arr.filter((e) => e.source && e.target);
  const colorFor = (t?: string) =>
    t === 'definition'
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : t === 'example'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-100 text-slate-700 border-slate-200';
  const labelOf = (id: string) => nodes.find((n) => n.id === id)?.label || id;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {nodes.map((n) => (
          <span key={n.id} className={`px-3 py-1.5 rounded-lg text-sm border ${colorFor(n.nodeType)}`}>
            {n.label}
          </span>
        ))}
      </div>
      {edges.length > 0 && (
        <ul className="text-xs text-slate-500 space-y-1">
          {edges.map((e, i) => (
            <li key={i}>
              {labelOf(e.source)} <span className="text-slate-400">→</span> {labelOf(e.target)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const DiagramRenderer: React.FC<{ visual: Visual }> = ({ visual }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
    <h4 className="text-sm font-bold text-slate-800 mb-1">{visual.title}</h4>
    {visual.description && <p className="text-xs text-slate-500 mb-4">{visual.description}</p>}
    {visual.type === 'mermaid' && <MermaidView code={visual.data} />}
    {visual.type === 'recharts' && <RechartsView data={visual.data} />}
    {visual.type === 'react_flow' && <FlowView data={visual.data} />}
  </div>
);
