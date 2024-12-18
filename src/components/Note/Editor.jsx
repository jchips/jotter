import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, HStack } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import { useMarkdown } from '../../hooks/useMarkdown';
import { useAuth } from '@/hooks/useAuth';
import api from '@/util/api';
import Preview from './Preview';
import './Note.scss';
import '../../assets/markdown.scss';
import Loading from '../Loading';

const Editor = () => {
  const [note, setNote] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { markdown, setMarkdown } = useMarkdown();
  const { logout } = useAuth();
  const { noteId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getNote = async () => {
      try {
        setLoading(true);
        setError('');
        let note = await api.getNote(noteId);
        console.log('note:', note.data[0]); // delete later
        setNote(note.data[0]);
        setMarkdown(note.data[0].content);
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

  const update = (e) => {
    const value = e.target.value;
    setMarkdown(value);
  };

  const handleSave = async () => {
    console.log(markdown); // delete later
    try {
      setError('');
      setLoading(true);
      let res = await api.updateNote(
        {
          content: markdown,
          updatedAt: Date.now(),
        },
        note.id
      );
      console.log('updated note:', res.data); // delete later
    } catch (err) {
      setError('Failed to save note');
      console.error(err);
    }
    setLoading(false);
  };

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
      <div className='note-body'>
        <div className='editor__wrap'>
          <textarea
            value={markdown}
            className='editor'
            onChange={update}
            placeholder='Type Markdown here...'
          />
        </div>
        <Preview />
      </div>
      <div className='footer'>
        <HStack>
          <Button
            className='save-btn'
            variant='solid'
            onClick={handleSaveAndExit}
          >
            Save and exit
          </Button>
          <Button
            className='save-btn'
            variant='solid'
            onClick={handleSave}
            disabled={loading}
          >
            Save changes
          </Button>
        </HStack>
      </div>
    </div>
  );
};

export default Editor;
