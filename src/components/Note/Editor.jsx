import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { throttle } from 'lodash';
import { Button, HStack, Text, Box } from '@chakra-ui/react';
import { LuSave, LuSquareX } from 'react-icons/lu';
import CodeMirror from './CodeMirror';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useMarkdown } from '../../hooks/useMarkdown';
import { useAuth } from '@/hooks/useAuth';
import ExitNote from '../modals/ExitNote';
import getWordCount from '@/util/getWordCount';
import api from '@/util/api';
import Preview from './Preview';
import Loading from '../Loading';
import ErrAlert from '../ErrAlert';
import './Editor.scss';
import './markdown.scss';

const Editor = () => {
  const [note, setNote] = useState();
  const [error, setError] = useState('');
  const [words, setWords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openExit, setOpenExit] = useState(false);
  const { markdown, setMarkdown } = useMarkdown();
  const { logout } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const { width } = useWindowDimensions();
  const configs = useSelector((state) => state.configs.value);

  // fetch the note
  useEffect(() => {
    const getNote = async () => {
      setLoading(true);
      try {
        setError('');
        let note = await api.getNote(noteId);
        setNote(note.data);
        setMarkdown(note.data.content);
        setWords(getWordCount(note.data.content));
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

  // Syncs the editor and preview scrollbars to each other
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
            (previewRef.current.scrollHeight - previewRef.current.clientHeight);
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
  const update = useCallback(
    (value) => {
      setMarkdown(value);
      setWords(getWordCount(value));
    },
    [setMarkdown]
  );

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
      setNote(res.data);
    } catch (err) {
      setError('Failed to save note');
      console.error(err);
    }
    setSaving(false);
  }, [markdown, noteId]);

  // Saves the note and exits
  const handleSaveAndExit = useCallback(() => {
    handleSave();
    navigate(`/view/${noteId}`);
  }, [navigate, handleSave, noteId]);

  // Exits the editor without saving
  const handleExit = useCallback(() => {
    if (note.content !== markdown) {
      setOpenExit(true);
    } else {
      navigate(`/view/${noteId}`);
    }
  }, [markdown, navigate, note, noteId]);

  /**
   * Handles key press options
   * ctrl/cmd-s: save the new changes
   * ctrl/cmd-e: save and exit note
   * alt-q: exit the editor without saving
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleSaveAndExit();
      } else if (e.altKey && e.code === 'KeyQ') {
        e.preventDefault();
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markdown, handleSave, handleSaveAndExit, handleExit]);

  // Loading circle
  if (!note) {
    return <Loading />;
  }

  return (
    <div className='note-window'>
      {error && <ErrAlert error={error} m={10} />}
      {!loading && (
        <div className='note-body'>
          <div className='editor__wrap' ref={editorRef}>
            <CodeMirror
              value={markdown}
              placeholderText='Type Markdown here...'
              indentWithTab={true}
              onChange={update}
              options={{
                lineWrapping: true,
                indentWithTabs: true,
              }}
            />
          </div>
          <div className='preview__scroll' ref={previewRef}>
            <Preview markdown={markdown} />
          </div>
        </div>
      )}
      <HStack className='footer'>
        <Button className='button1' variant='solid' onClick={handleSaveAndExit}>
          Save and exit
        </Button>
        {!configs?.hideWordCount && <Text>{words} words</Text>}
        <Box style={{ display: 'flex' }}>
          <Button
            className='button1'
            variant='solid'
            onClick={handleExit}
            aria-label='Exit editor'
          >
            {width > 768 ? 'Exit editor' : <LuSquareX />}
          </Button>
          <Button
            className='button1'
            variant='solid'
            onClick={handleSave}
            disabled={saving}
            aria-label='Save changes'
          >
            {width > 768 ? 'Save changes' : <LuSave />}
          </Button>
        </Box>
      </HStack>
      <ExitNote openExit={openExit} setOpenExit={setOpenExit} noteId={noteId} />
    </div>
  );
};

export default Editor;
