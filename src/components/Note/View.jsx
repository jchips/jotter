import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, HStack } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { useMarkdown } from '../../hooks/useMarkdown';
import Preview from './Preview';
import Loading from '../Loading';
import TitleBar from '../Navbars/TitleBar';
import ChangeTitle from '../modals/ChangeTitle';
import MoveModal from '../modals/MoveModal';
import DeleteModal from '../modals/DeleteModal';
import getWordCount from '@/util/getWordCount';
import api from '@/util/api';
import './Preview.scss';
import './markdown.scss';

const View = () => {
  const [note, setNote] = useState();
  const [error, setError] = useState('');
  const [words, setWords] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
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
          setDeleteOpen={setDeleteOpen}
          setMoveOpen={setMoveOpen}
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
        <DeleteModal
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
      </div>
    )
  );
};

export default View;
