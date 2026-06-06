import React, { useMemo } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { UIProvider, ChatProvider, useUI } from './store';
import { ANALYZED_DATA, SUBJECT_META, UNIT_DESCRIPTIONS } from './data/constants';
import { filterData } from './lib/frequency';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TopicCard } from './components/TopicCard';
import { SyllabusGaps } from './components/SyllabusGaps';
import { ChatModal } from './components/ChatModal';

const MainContent: React.FC = () => {
  const { activeUnit, searchTerm, setSearchTerm } = useUI();

  const filtered = useMemo(
    () => filterData(ANALYZED_DATA, activeUnit, searchTerm),
    [activeUnit, searchTerm],
  );

  const showDashboard = activeUnit === 'dashboard' && !searchTerm;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 sm:px-8 py-4 flex justify-between items-center gap-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-800 truncate">
              {activeUnit === 'dashboard' ? 'Exam Analysis Dashboard' : `Unit ${activeUnit} Analysis`}
            </h2>
            <p className="text-sm text-slate-500 truncate">
              {activeUnit === 'dashboard'
                ? `Overview of ${SUBJECT_META.paperCount} ${SUBJECT_META.name} papers`
                : UNIT_DESCRIPTIONS[activeUnit as number]}
            </p>
          </div>
          <div className="relative w-44 sm:w-72 shrink-0">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics…"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </header>

        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {showDashboard ? (
            <Dashboard />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-700">
                  {searchTerm ? `Search results for "${searchTerm}"` : 'Topic List'}
                </h3>
                <span className="text-sm text-slate-500">{filtered.length} topics</span>
              </div>

              {filtered.length > 0 ? (
                <>
                  {filtered.map((t) => (
                    <TopicCard key={t.id} topic={t} />
                  ))}
                  {activeUnit !== 'dashboard' && !searchTerm && <SyllabusGaps unit={activeUnit as number} />}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <AlertCircle size={44} className="mb-4 opacity-50" />
                  <p>No topics match your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ChatModal />
    </div>
  );
};

const App: React.FC = () => (
  <UIProvider>
    <ChatProvider>
      <MainContent />
    </ChatProvider>
  </UIProvider>
);

export default App;
