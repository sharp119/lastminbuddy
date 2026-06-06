import { Frequency, TopicGroup } from '../types';

export const FREQUENCY_PRIORITY: Record<Frequency, number> = {
  [Frequency.VERY_HIGH]: 4,
  [Frequency.HIGH]: 3,
  [Frequency.MEDIUM]: 2,
  [Frequency.LOW]: 1,
};

export function sortByFrequency(data: TopicGroup[]): TopicGroup[] {
  return [...data].sort(
    (a, b) => FREQUENCY_PRIORITY[b.frequency] - FREQUENCY_PRIORITY[a.frequency] || b.count - a.count,
  );
}

/** Bucket a marks string ("6 Marks", "3–4 Marks") into the answer-depth band. */
export function markBucket(marks?: string): '2-3' | '4-5' | '6+' {
  if (!marks) return '6+';
  const nums = (marks.match(/\d+/g) || []).map(Number);
  const max = nums.length ? Math.max(...nums) : 6;
  if (max <= 3) return '2-3';
  if (max <= 5) return '4-5';
  return '6+';
}

export function totals(data: TopicGroup[]) {
  const totalTopics = data.length;
  const questionsAnalyzed = data.reduce((acc, t) => acc + t.variants.length, 0);
  const highPriority = data.filter(
    (t) => t.frequency === Frequency.VERY_HIGH || t.frequency === Frequency.HIGH,
  ).length;
  return { totalTopics, questionsAnalyzed, highPriority };
}

export function listUnits(data: TopicGroup[]): number[] {
  return Array.from(new Set(data.map((t) => t.unit))).sort((a, b) => a - b);
}

export function unitDistribution(data: TopicGroup[]) {
  const map = new Map<number, number>();
  data.forEach((t) => map.set(t.unit, (map.get(t.unit) || 0) + t.count));
  return listUnits(data).map((u) => ({ name: `Unit ${u}`, value: map.get(u) || 0 }));
}

export function topTopics(data: TopicGroup[], n = 5) {
  return sortByFrequency(data)
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((t) => ({ name: t.title, count: t.count }));
}

export function filterData(data: TopicGroup[], activeUnit: number | 'dashboard', searchTerm: string) {
  let out = data;
  if (activeUnit !== 'dashboard') out = out.filter((t) => t.unit === activeUnit);
  const q = searchTerm.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.variants.some((v) => v.text.toLowerCase().includes(q)),
    );
  }
  return sortByFrequency(out);
}
