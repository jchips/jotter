import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, HStack } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { useMarkdown } from '../../hooks/useMarkdown';
import Preview from './Preview';
import Loading from '../Loading';
import Title from '../Navbars/Title';
import ChangeTitle from '../modals/ChangeTitle';
import DeleteConfirmation from '../modals/DeleteConfirmation';
import api from '@/util/api';
import './Preview.scss';
import '../../assets/markdown.scss';

const View = () => {
  const [note, setNote] = useState();
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [delConfirmOpen, setDelConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { markdown, setMarkdown } = useMarkdown('');
  const { logout } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getNote = async () => {
      try {
        setLoading(true);
        setError('');
        let note = await api.getNote(noteId);
        console.log('note:', note.data); // delete later
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

  const handleEdit = () => {
    navigate(`/editor/${noteId}`);
  };

  const handleExit = () => {
    navigate(-1);
    setMarkdown('');
  };

  if (!note) {
    return <Loading />;
  }

  return (
    !loading && (
      <div className='view'>
        <Title
          note={note}
          setIsOpen={setIsOpen}
          setDelConfirmOpen={setDelConfirmOpen}
        />
        <div className='preview__wrapper'>
          <Preview markdown={markdown} />
        </div>
        <div className='footer'>
          <HStack>
            <Button className='button2' variant='solid' onClick={handleExit}>
              Exit
            </Button>
            <Button className='button1' variant='solid' onClick={handleEdit}>
              Edit note
            </Button>
          </HStack>
        </div>
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
