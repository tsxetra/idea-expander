import React from 'react';
import { LightBulbIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="py-8 px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center space-x-3">
        <LightBulbIcon className="h-8 w-8 text-accent" />
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-ink">
          Idea Expander
        </h1>
      </div>
    </header>
  );
};