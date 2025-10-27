import React from 'react';
import { SparklesIcon } from './icons';

interface OutlineDisplayProps {
  outline: string;
  isLoading: boolean;
  error: string | null;
}

// Helper function to parse inline markdown elements like bold, code, and links.
const parseInlineText = (text: string): React.ReactNode[] => {
  // Regex to capture **bold**, `code`, and [link](url)
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.filter(part => part).map((part, index) => {
    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-ink">{part.slice(2, -2)}</strong>;
    }
    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="bg-ink/10 text-accent font-mono text-sm rounded-sm px-1.5 py-0.5 mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Link: [text](url)
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const [, text, url] = linkMatch;
      return (
        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent-dark transition-colors">
          {text}
        </a>
      );
    }
    // Plain text
    return part;
  });
};


// Renders a string of Markdown to JSX elements
const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';

  const flushList = () => {
    if (listItems.length > 0) {
      if (currentListType === 'ul') {
        renderedElements.push(<ul key={`ul-${renderedElements.length}`} className="space-y-2 list-disc list-inside pl-2">{listItems}</ul>);
      } else if (currentListType === 'ol') {
        renderedElements.push(<ol key={`ol-${renderedElements.length}`} className="space-y-2 list-decimal list-inside pl-2">{listItems}</ol>);
      }
      listItems = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code Blocks (```)
    if (line.startsWith('```')) {
      flushList();
      if (inCodeBlock) {
        inCodeBlock = false;
        renderedElements.push(
          <pre key={`code-${renderedElements.length}`} className="bg-ink/5 p-4 rounded-sm my-2 overflow-x-auto">
            <code className={`language-${codeBlockLang} font-mono text-sm text-ink-subtle`}>
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        );
        codeBlockContent = [];
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList();
      renderedElements.push(<h3 key={i} className="text-xl font-serif font-bold text-ink mt-6 mb-2">{parseInlineText(line.substring(4))}</h3>);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      renderedElements.push(<h2 key={i} className="text-2xl font-serif font-bold text-ink mt-8 mb-3">{parseInlineText(line.substring(3))}</h2>);
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      flushList();
      renderedElements.push(
        <blockquote key={i} className="border-l-4 border-accent/50 pl-4 italic text-ink-subtle">
          {parseInlineText(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Horizontal Rule
    if (line.startsWith('---')) {
      flushList();
      renderedElements.push(<hr key={i} className="my-6 border-ink/10" />);
      continue;
    }

    // Unordered List
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (currentListType !== 'ul') {
        flushList();
        currentListType = 'ul';
      }
      listItems.push(<li key={i}>{parseInlineText(line.substring(2))}</li>);
      continue;
    }

    // Ordered List
    const olMatch = line.match(/^(\d+)\.\s/);
    if (olMatch) {
      if (currentListType !== 'ol') {
        flushList();
        currentListType = 'ol';
      }
      listItems.push(<li key={i}>{parseInlineText(line.substring(olMatch[0].length))}</li>);
      continue;
    }

    // If we've reached here, it means any ongoing list has ended
    flushList();

    // Paragraph (or empty line for spacing)
    if (line.trim() !== '') {
        renderedElements.push(<p key={i} className="leading-relaxed text-ink-subtle">{parseInlineText(line)}</p>);
    }
  }

  // Flush any remaining list after the loop
  flushList();

  return renderedElements;
};

export const OutlineDisplay: React.FC<OutlineDisplayProps> = ({ outline, isLoading, error }) => {
  const hasContent = !!outline;
  const showInitialState = !isLoading && !error && !hasContent;

  return (
    <div className="mt-6 min-h-[20rem] transition-all duration-300">
      {isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-ink-subtle">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-lg">Cultivating your plan...</p>
          <p className="text-sm">Great ideas take a moment to develop.</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-full text-[#DC322F]">
          <p className="font-bold text-lg">A problem occurred.</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {showInitialState && (
        <div className="flex flex-col items-center justify-center h-full text-center text-ink-subtle/70">
           <SparklesIcon className="h-12 w-12 mb-4 opacity-30"/>
          <p className="font-semibold text-lg">Your cultivated plan will appear here.</p>
           <p className="text-sm">Ready to turn your vision into a blueprint?</p>
        </div>
      )}
      {hasContent && (
        <div className="text-ink space-y-4">
            {renderMarkdown(outline)}
        </div>
      )}
    </div>
  );
};