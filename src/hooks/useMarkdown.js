import { useContext } from 'react';
import MarkdownContext from '../contexts/MDContext';

export function useMarkdown() {
  return useContext(MarkdownContext);
}
