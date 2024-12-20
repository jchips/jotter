import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Box } from '@chakra-ui/react';
import './Preview.scss';
import '../../assets/markdown.scss';

const Preview = ({ markdown, previewRef }) => {
  return (
    <div className='preview__scroll' ref={previewRef}>
      <Box className='markdown-wrapper'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
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
          {markdown}
        </ReactMarkdown>
      </Box>
    </div>
  );
};

export default Preview;
