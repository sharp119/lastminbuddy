import React, { useEffect, useRef, useState } from 'react';
import { Wand2, BookOpen } from 'lucide-react';
import { DeepDiveMode } from '../types';

interface Props {
  containerRef: React.RefObject<HTMLElement>;
  onDeepDive: (selectedText: string, mode: DeepDiveMode) => void;
}

export const TextSelectionMenu: React.FC<Props> = ({ containerRef, onDeepDive }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [text, setText] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseUp = () => {
      const sel = window.getSelection();
      const t = sel?.toString().trim() || '';
      if (t.length > 3 && sel && sel.rangeCount > 0) {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        const cRect = container.getBoundingClientRect();
        setPos({
          top: rect.top - cRect.top + container.scrollTop - 44,
          left: rect.left - cRect.left + container.scrollLeft + rect.width / 2 - 90,
        });
        setText(t);
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setVisible(false);
    };

    container.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      container.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [containerRef]);

  const trigger = (mode: DeepDiveMode) => {
    if (text) {
      onDeepDive(text, mode);
      setVisible(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="flex gap-1 p-1 bg-slate-900 rounded-lg shadow-xl animate-fade-in"
      style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 1000 }}
    >
      <button
        onClick={() => trigger('eli5')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 rounded"
      >
        <Wand2 size={14} className="text-pink-400" /> Explain Simplified
      </button>
      <div className="w-px bg-slate-700 my-1" />
      <button
        onClick={() => trigger('notes')}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 rounded"
      >
        <BookOpen size={14} className="text-indigo-400" /> Revision Notes
      </button>
    </div>
  );
};
