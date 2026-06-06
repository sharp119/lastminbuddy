import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const CodeBlock: React.FC<{ language: string; value: string }> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative my-6 rounded-lg overflow-hidden border border-slate-700 shadow">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-400 text-xs">
        <span className="font-mono lowercase">{language || 'code'}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{ margin: 0, padding: '1.25rem', background: '#1e293b', fontSize: '0.85rem', lineHeight: '1.6' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export const Markdown: React.FC<{ children: string }> = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{
      p: ({ node, ...props }: any) => <p className="mb-5 leading-7 text-slate-700" {...props} />,
      strong: ({ node, ...props }: any) => (
        <strong
          className="font-bold text-[#D32F2F] underline decoration-[#D32F2F] decoration-2 underline-offset-2"
          {...props}
        />
      ),
      h1: ({ node, ...props }: any) => (
        <h1 className="text-2xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-200" {...props} />
      ),
      h2: ({ node, ...props }: any) => <h2 className="text-xl font-bold text-slate-900 mt-7 mb-3" {...props} />,
      h3: ({ node, ...props }: any) => <h3 className="text-lg font-bold text-indigo-900 mt-6 mb-3" {...props} />,
      ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-5 space-y-2" {...props} />,
      ol: ({ node, ...props }: any) => (
        <ol className="list-decimal pl-6 mb-5 space-y-2 marker:text-indigo-600 marker:font-bold" {...props} />
      ),
      li: ({ node, ...props }: any) => <li className="leading-7" {...props} />,
      blockquote: ({ node, ...props }: any) => (
        <blockquote
          className="border-l-4 border-indigo-500 bg-indigo-50/50 pl-5 py-3 my-6 rounded-r-lg italic text-slate-700"
          {...props}
        />
      ),
      a: ({ node, ...props }: any) => (
        <a className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
      ),
      table: ({ node, ...props }: any) => (
        <div className="overflow-x-auto my-6 rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 bg-white" {...props} />
        </div>
      ),
      thead: ({ node, ...props }: any) => <thead className="bg-slate-50" {...props} />,
      th: ({ node, ...props }: any) => (
        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" {...props} />
      ),
      td: ({ node, ...props }: any) => (
        <td className="px-4 py-3 text-sm text-slate-600 align-top border-t border-slate-100" {...props} />
      ),
      code: ({ node, className, children, ...rest }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        const value = String(children).replace(/\n$/, '');
        if (match) return <CodeBlock language={match[1]} value={value} />;
        return (
          <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...rest}>
            {children}
          </code>
        );
      },
    }}
  >
    {children}
  </ReactMarkdown>
);
