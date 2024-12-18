// import {useState, useEffect} from 'react';
// import { useParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Button, Box } from '@chakra-ui/react';
// import { useMarkdown } from '../../hooks/useMarkdown';
// import api from '@/util/api';
import './Note.scss';
import '../../assets/markdown.scss';

const Preview = ({ markdown }) => {
  // const [note, setNote] = useState();
  // const [error, setError] = useState('');
  // const [loading, setLoading] = useState(false);
  // const { markdown, setMarkdown } = useMarkdown();
  // const { noteId } = useParams();

  // useEffect(() => {
  //   const getNote = async () => {
  //     try {
  //       setLoading(true);
  //       setError('');
  //       let note = await api.getNote(noteId);
  //       console.log('note:', note.data[0]); // delete later
  //       setNote(note.data[0]);
  //       setMarkdown(note.data[0].content);
  //     } catch (err) {
  //       console.error(err);
  //       err.response.data.message === 'jwt expired'
  //         ? logUserOut()
  //         : setError('Failed to open note');
  //     }
  //   };
  //   const logUserOut = () => {
  //     navigate('/login');
  //     logout();
  //   };
  //   getNote();
  //   setLoading(false);
  // }, [noteId, setMarkdown, logout, navigate]);

  return (
    // <div className='preview-window'>
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
    // </div>
  );
};

export default Preview;
