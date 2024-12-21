import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { throttle } from 'lodash';
import { Button, HStack } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as md } from '@codemirror/lang-markdown';
import { EditorView } from '@uiw/react-codemirror';
import { useMarkdown } from '../../hooks/useMarkdown';
import { useAuth } from '@/hooks/useAuth';
import Preview from './Preview';
import Loading from '../Loading';
import api from '@/util/api';
import './Editor.scss';
import '../../assets/markdown.scss';

const Editor = () => {
  const [note, setNote] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { markdown, setMarkdown } = useMarkdown();
  const { logout } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef(null);

  // fetch the note
  useEffect(() => {
    const getNote = async () => {
      setLoading(true);
      try {
        setError('');
        let note = await api.getNote(noteId);
        setNote(note.data);
        setMarkdown(note.data.content);
      } catch (err) {
        console.error(err);
        err.response.data.message === 'jwt expired'
          ? logUserOut()
          : setError('Failed to open note');
      }
    };
    const logUserOut = () => {
      navigate('/login');
      logout();
    };
    getNote();
    setLoading(false);
  }, [noteId, setMarkdown, logout, navigate]);

  // sync the editor and preview scrollbars to each other
  const editorRef = useCallback((node) => {
    if (node) {
      const editorView = node;
      const syncScroll = throttle(() => {
        const scrollRatio =
          editorView.scrollTop /
          (editorView.scrollHeight - editorView.clientHeight);
        if (
          previewRef.current &&
          previewRef.current.scrollHeight > previewRef.current.clientHeight
        ) {
          previewRef.current.scrollTop =
            scrollRatio *
              (previewRef.current.scrollHeight -
                previewRef.current.clientHeight) +
            10;
        }
      }, 100);
      editorView.addEventListener('scroll', syncScroll);
      node.cleanup = () => editorView.removeEventListener('scroll', syncScroll);
    } else {
      editorRef.current?.cleanup?.();
    }
  }, []);

  /**
   * Updates the markdown state with the current markdown content
   * @param {String} value - The markdown content that user types
   */
  const update = (value) => {
    setMarkdown(value);
  };

  // Saves changes to the note
  const handleSave = useCallback(async () => {
    try {
      setError('');
      setSaving(true);
      let res = await api.updateNote(
        {
          content: markdown,
          updatedAt: Date.now(),
        },
        noteId
      );
      console.log('updated note:', res.data); // delete later
    } catch (err) {
      setError('Failed to save note');
      console.error(err);
    }
    setSaving(false);
  }, [markdown, noteId]);

  // If user presses ctrl-s, the file saves it's changes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markdown, handleSave]);

  const handleSaveAndExit = () => {
    handleSave();
    navigate(-1);
  };

  if (!note) {
    return <Loading />;
  }

  return (
    <div className='note-window'>
      {error && (
        <div>
          <Alert status='error' title={error} />
        </div>
      )}
      {!loading && (
        <div className='note-body'>
          <div className='editor__wrap' ref={editorRef}>
            <CodeMirror
              value={markdown}
              className='editor'
              extensions={[md(), EditorView.lineWrapping]}
              placeholder='Type Markdown here...'
              onChange={update}
              options={{
                lineWrapping: true,
              }}
            />
          </div>
          <Preview markdown={markdown} previewRef={previewRef} />
        </div>
      )}
      <div className='footer'>
        <HStack>
          <Button
            className='button1'
            variant='solid'
            onClick={handleSaveAndExit}
          >
            Save and exit
          </Button>
          <Button
            className='button1'
            variant='solid'
            onClick={handleSave}
            disabled={saving}
          >
            Save changes
          </Button>
        </HStack>
      </div>
    </div>
  );
};

export default Editor;
