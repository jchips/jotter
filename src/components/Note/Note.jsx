import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Button, Box } from '@chakra-ui/react';
import { useMarkdown } from '../../hooks/useMarkdown';
import './Note.scss';
import '../../assets/markdown.scss';

const Note = () => {
  const { markdown, setMarkdown } = useMarkdown();
  const [loading, setLoading] = useState(false);

  const update = (e) => {
    const value = e.target.value;
    setMarkdown(value);
  };

  const handleSubmit = () => {
    console.log('markdown', markdown); // delete later
  };

  return (
    <div className='note-window'>
      <div className='note-body'>
        <div className='editor__wrap'>
          <textarea
            value={markdown}
            className='editor'
            onChange={update}
            placeholder='Type Markdown here...'
          />
        </div>
        <div className='preview'>
          <div className='preview__scroll'>
            <Box className='markdown-wrapper'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]} // Enable GitHub-flavored Markdown
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        PreTag='div'
                        {...props}
                      >
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
        </div>
      </div>
      <div className='footer'>
        <Button
          className='save-btn'
          variant='solid'
          onClick={handleSubmit}
          isDisabled={loading}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default Note;
