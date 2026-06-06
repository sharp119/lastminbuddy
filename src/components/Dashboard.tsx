import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { ANALYZED_DATA } from '../data/constants';
import { totals, unitDistribution, topTopics } from '../lib/frequency';
import { StatCard } from './StatCard';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];

export const Dashboard: React.FC = () => {
  const stats = useMemo(() => totals(ANALYZED_DATA), []);
  const dist = useMemo(() => unitDistribution(ANALYZED_DATA), []);
  const top = useMemo(() => topTopics(ANALYZED_DATA, 5), []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Topics" value={stats.totalTopics} />
        <StatCard label="Questions Analyzed" value={stats.questionsAnalyzed} />
        <StatCard label="High-Priority Topics" value={stats.highPriority} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Unit Distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={dist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Most Frequent Topics</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={top} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={150} style={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
