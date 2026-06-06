import React from 'react';
import { Frequency } from '../types';

const STYLES: Record<Frequency, string> = {
  [Frequency.VERY_HIGH]: 'bg-red-100 text-red-800 border-red-200',
  [Frequency.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
  [Frequency.MEDIUM]: 'bg-blue-100 text-blue-800 border-blue-200',
  [Frequency.LOW]: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const FrequencyBadge: React.FC<{ frequency: Frequency }> = ({ frequency }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STYLES[frequency]}`}>
    {frequency} Priority
  </span>
);
