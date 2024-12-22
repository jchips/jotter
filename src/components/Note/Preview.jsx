import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Box } from '@chakra-ui/react';
import './Preview.scss';
import './markdown.scss';

const Preview = ({ markdown }) => {
  /**
   * Replaces blank lines with '<br>' to preserve blank spaces
   * @param {String} markdown - Markdown content
   * @returns {String} - Markdown content with the added '<br>'s
   */
  const preserveBlankLines = (markdown) => {
    return markdown.replace(/^\s*\n$/gm, '<br/>');
  };

  return (
    <Box className='markdown-wrapper'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter language={match[1]} PreTag='div' {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {preserveBlankLines(markdown)}
      </ReactMarkdown>
    </Box>
  );
};

export default Preview;
