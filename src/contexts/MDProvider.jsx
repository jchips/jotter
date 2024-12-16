import { useState } from 'react';
import MarkdownContext from './MDContext';

export function MarkdownProvider({ children }) {
  const [markdown, setMarkdown] = useState('');
  const value = { markdown, setMarkdown };
  return (
    <MarkdownContext.Provider value={value}>
      {children}
    </MarkdownContext.Provider>
  );
}
