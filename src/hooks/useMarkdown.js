import { useContext } from 'react';
import MarkdownContext from '../contexts/MDContext';

// Hook to use Markdown context
export function useMarkdown() {
  return useContext(MarkdownContext);
}
