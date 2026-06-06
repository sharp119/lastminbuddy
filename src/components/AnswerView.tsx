import React from 'react';
import { AIExplanation } from '../types';
import { Markdown } from './Markdown';
import { SourceList } from './SourceList';
import { DiagramRenderer } from './DiagramRenderer';

export const AnswerView: React.FC<{ answer: AIExplanation }> = ({ answer }) => (
  <div>
    {answer.summary && (
      <div className="mb-6 pb-5 border-b border-slate-100">
        <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest block mb-2">Summary</span>
        <p className="text-lg font-medium text-slate-900 leading-relaxed">{answer.summary}</p>
      </div>
    )}

    <div className="markdown-content">
      <Markdown>{answer.answer_content}</Markdown>
    </div>

    {answer.visuals && answer.visuals.length > 0 && (
      <div className="mt-6 space-y-6">
        {answer.visuals.map((v, i) => (
          <DiagramRenderer key={i} visual={v} />
        ))}
      </div>
    )}

    {answer.sources && <SourceList sources={answer.sources} />}
  </div>
);
