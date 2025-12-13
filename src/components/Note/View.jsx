import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useMarkdown } from '@/hooks/useMarkdown';
import getWordCount from '@/util/getWordCount';
import api from '@/util/api';
import Preview from './Preview';
import Loading from '../Loading';
import Error404 from '../404';
import ViewNav from '../Navbars/ViewNav';
import ViewFooter from '../Navbars/ViewFooter';
import ImportNote from '../modals/ImportNote';
import ChangeTitle from '../modals/ChangeTitle';
import MoveModal from '../modals/MoveModal';
import DeleteItem from '../modals/DeleteItem';
import ErrAlert from '../ErrAlert';
import './Preview.scss';
import './markdown.scss';

const View = () => {
  const [note, setNote] = useState();
  const [error, setError] = useState('');
  const [words, setWords] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { markdown, setMarkdown } = useMarkdown('');
  const { logout } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();

  // fetches the note
  useEffect(() => {
    const getNote = async () => {
      try {
        setLoading(true);
        setError('');
        let note = await api.getNote(noteId);
        setNote(note.data);
        setMarkdown(note.data.content);
        setWords(getWordCount(note.data.content));
      } catch (err) {
        console.error(err);
        if (err.status === 403 || err.status === 404) {
          setError('404');
        } else {
          err.response.data.message === 'jwt expired'
            ? logUserOut()
            : setError('Failed to open note');
        }
      } finally {
        setLoading(false);
      }
    };
    const logUserOut = () => {
      navigate('/login');
      logout();
    };
    getNote();
  }, [noteId, setMarkdown, logout, navigate]);

  // Navigates one page back
  const handleExit = useCallback(() => {
    note.folderId ? navigate(`/folder/${note.folderId}`) : navigate('/');
    setMarkdown('');
  }, [navigate, setMarkdown, note]);

  // Navigates to the editor
  const handleEdit = useCallback(() => {
    navigate(`/editor/${noteId}`);
  }, [navigate, noteId]);

  /**
   * Handles key press options
   * ctrl/cmd-x or ctrl/cmd-e or alt-q: exit note
   * ctrl/cmd-o or alt-o: edit note
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'x') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'e') ||
        (e.altKey && e.code === 'KeyQ')
      ) {
        e.preventDefault();
        handleExit();
      } else if ((e.ctrlKey || e.metaKey || e.altKey) && e.code === 'KeyO') {
        e.preventDefault();
        handleEdit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markdown, handleExit, handleEdit]);

  // Downloads the note as an .md file to user's device
  const exportNote = () => {
    const link = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = note.title + '.md';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  /**
   * Imports a markdown file
   * @param {Object} mdFile - The file to import
   */
  const importNote = async (mdFile) => {
    try {
      setError('');
      let getTextRes = await mdFile.text();
      setMarkdown(getTextRes);
      let updateRes = await api.updateNote(
        {
          content: getTextRes,
          updatedAt: Date.now(),
        },
        noteId
      );
      setNote(updateRes.data);
      setImportOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Error handling and loading circle
  if (!note && error === '404') {
    return <Error404 />;
  } else if (!note && error !== '404') {
    return <Loading />;
  }

  return (
    !loading && (
      <div className='view'>
        <ViewNav
          note={note}
          setIsOpen={setIsOpen}
          setDeleteOpen={setDeleteOpen}
          setMoveOpen={setMoveOpen}
          words={words}
        />
        {error ? <ErrAlert error={error} m={10} /> : null}
        <div className='preview__wrapper'>
          <Preview markdown={markdown} />
        </div>
        <ViewFooter
          handleEdit={handleEdit}
          handleExit={handleExit}
          setImportOpen={setImportOpen}
          exportNote={exportNote}
        />
        <ChangeTitle
          note={note}
          setNote={setNote}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <DeleteItem
          note={note}
          deleteOpen={deleteOpen}
          setDeleteOpen={setDeleteOpen}
          type={'note'}
        />
        <MoveModal
          moveOpen={moveOpen}
          setMoveOpen={setMoveOpen}
          type='note'
          note={note}
          folders={{}}
        />
        <ImportNote
          importOpen={importOpen}
          setImportOpen={setImportOpen}
          importNote={importNote}
        />
      </div>
    )
  );
};

export default View;
