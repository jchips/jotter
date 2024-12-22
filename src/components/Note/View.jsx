import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, HStack } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { useMarkdown } from '../../hooks/useMarkdown';
import Preview from './Preview';
import Loading from '../Loading';
import TitleBar from '../Navbars/TitleBar';
import ChangeTitle from '../modals/ChangeTitle';
import DeleteConfirmation from '../modals/DeleteNote';
import getWordCount from '@/util/getWordCount';
import api from '@/util/api';
import './Preview.scss';
import './markdown.scss';

const View = () => {
  const [note, setNote] = useState();
  const [error, setError] = useState('');
  const [words, setWords] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [delConfirmOpen, setDelConfirmOpen] = useState(false);
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

  // Navigates to the editor
  const handleEdit = () => {
    navigate(`/editor/${noteId}`);
  };

  // Navigates one page back
  const handleExit = () => {
    note.folderId ? navigate(`/folder/${note.folderId}`) : navigate('/');
    setMarkdown('');
  };

  // Loading circle
  if (!note) {
    return <Loading />;
  }

  return (
    !loading && (
      <div className='view'>
        <TitleBar
          note={note}
          setIsOpen={setIsOpen}
          setDelConfirmOpen={setDelConfirmOpen}
          words={words}
        />
        <div className='preview__wrapper'>
          <Preview markdown={markdown} />
        </div>
        <HStack className='footer'>
          <Button className='button2' variant='solid' onClick={handleExit}>
            Exit
          </Button>
          <Button className='button1' variant='solid' onClick={handleEdit}>
            Edit note
          </Button>
        </HStack>
        <ChangeTitle
          note={note}
          setNote={setNote}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          type={'note'}
        />
        <DeleteConfirmation
          note={note}
          delConfirmOpen={delConfirmOpen}
          setDelConfirmOpen={setDelConfirmOpen}
          type={'note'}
        />
      </div>
    )
  );
};

export default View;
