import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircleQuestion } from 'lucide-react';
import { TopicGroup } from '../types';
import { FrequencyBadge } from './FrequencyBadge';
import { useChat } from '../store';

export const TopicCard: React.FC<{ topic: TopicGroup }> = ({ topic }) => {
  const [open, setOpen] = useState(false);
  const { openChat } = useChat();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4 overflow-hidden">
      <button
        className="w-full p-5 flex justify-between items-start text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-800">{topic.title}</h3>
            <FrequencyBadge frequency={topic.frequency} />
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {topic.count} Occurrences
            </span>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{topic.description}</p>
        </div>
        <span className="ml-4 text-slate-400">{open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
      </button>

      {open && (
        <div className="bg-slate-50 border-t border-slate-100 p-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Exam Variants</h4>
          <div className="space-y-3">
            {topic.variants.map((v, i) => (
              <div key={i} className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-700 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{v.paper}</span>
                  {v.marks && (
                    <span className="font-mono text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 whitespace-nowrap">
                      {v.marks}
                    </span>
                  )}
                </div>
                <p className="font-medium">{v.text}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => openChat(v.text, topic.title, v.marks)}
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                  >
                    <MessageCircleQuestion size={14} />
                    Explain with AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
