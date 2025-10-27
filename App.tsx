import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { IdeaInputForm } from './components/IdeaInputForm';
import { OutlineDisplay } from './components/OutlineDisplay';
import { expandIdea } from './services/geminiService';

const App: React.FC = () => {
  const [outline, setOutline] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleExpand = useCallback(async (idea: string) => {
    if (!idea.trim()) {
      setError('Please provide an idea to cultivate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutline('');

    try {
      const result = await expandIdea(idea);
      setOutline(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-parchment text-ink font-sans">
      <Header />
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="bg-white/60 rounded-sm shadow-md border border-ink/10">
          <div className="p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-ink mb-2">From Seed to Strategy</h2>
            <p className="text-ink-subtle text-center mb-8 max-w-2xl mx-auto">
              A fleeting thought deserves a strong foundation. Plant your idea below, and watch it grow into a structured plan.
            </p>
            <IdeaInputForm onExpand={handleExpand} isLoading={isLoading} />
          </div>
          <div className="px-6 md:px-10 pb-10">
            <OutlineDisplay 
              outline={outline} 
              isLoading={isLoading} 
              error={error} 
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;