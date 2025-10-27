import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface IdeaInputFormProps {
  onExpand: (idea: string) => void;
  isLoading: boolean;
}

export const IdeaInputForm: React.FC<IdeaInputFormProps> = ({ onExpand, isLoading }) => {
  const [idea, setIdea] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExpand(idea);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <textarea
          id="idea-input"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., A subscription box for artisanal cheese..."
          className="w-full h-28 p-3 bg-parchment/50 border-2 border-ink/10 rounded-sm focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-300 resize-none placeholder:text-ink-subtle/70"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !idea.trim()}
        className="w-full flex items-center justify-center gap-2 bg-accent text-parchment font-bold py-3 px-6 rounded-sm hover:bg-accent-dark disabled:bg-ink-subtle disabled:cursor-not-allowed transition-colors duration-300"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-parchment border-t-transparent rounded-full animate-spin"></div>
            <span>Cultivating...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5" />
            <span>Cultivate Plan</span>
          </>
        )}
      </button>
    </form>
  );
};