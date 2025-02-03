import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { useFolder } from '@/hooks/useFolder';
import { useMarkdown } from '@/hooks/useMarkdown';
import { setFolders, setNotes } from '@/reducers';
import Error404 from '../404';
import Loading from '../Loading';
import AddTitle from '../modals/AddTitle';
import DisplayNotes from './DisplayNotes';
import Navbar from '../Navbars/Navbar';
import DisplayFolders from './DisplayFolders';
import MoveModal from '../modals/MoveModal';
import DeleteModal from '../modals/DeleteModal';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import api from '@/util/api';
import './Dashboard.scss';

const Dashboard = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addTitleOpen, setAddTitleOpen] = useState(false);
  const [selectedCreate, setSelectedCreate] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const { user, logout } = useAuth();
  const { setMarkdown } = useMarkdown();
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { state = {} } = useLocation();
  const { folder } = useFolder(folderId, state?.folder);
  const folders = useSelector((state) => state.folders.value);
  const notes = useSelector((state) => state.notes.value);
  const dispatch = useDispatch();

  // Fetch folders and notes
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setMarkdown('');
      let folder_id = folderId === undefined ? null : folderId;
      try {
        setError('');
        const [foldersRes, notesRes] = await Promise.all([
          api.getFolders(folder_id),
          folder_id ? api.getNotes(folder_id) : api.getRootNotes(),
        ]);
        dispatch(setFolders(foldersRes.data));
        dispatch(setNotes(notesRes.data));
      } catch (err) {
        console.error(err);
        if (err.status === 403 || err.status === 404) {
          setError('404');
        } else if (err.response.data.message === 'jwt expired') {
          logout();
        } else {
          setError('Could not fetch content');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [logout, setMarkdown, folderId, dispatch]);

  // Loading circle
  if (loading) {
    return <Loading />;
  }

  // 403 or 404 redirect
  if (error === '404') {
    return <Error404 />;
  }

  // logs user out
  const logUserOut = () => {
    navigate('/login');
    logout();
  };

  return (
    !loading && (
      <div className='dashboard'>
        <Navbar
          logout={logUserOut}
          setSelectedCreate={setSelectedCreate}
          setAddTitleOpen={setAddTitleOpen}
          setDeleteOpen={setDeleteOpen}
          setMoveOpen={setMoveOpen}
          setError={setError}
          notes={notes}
          folders={folders}
          currentFolder={folder?.data}
        />
        {folderId && folderId !== 'null' && (
          <FolderBreadcrumbs currentFolder={folder} />
        )}
        {folders && <DisplayFolders folders={folders} error={error} />}
        {notes && (
          <DisplayNotes notes={notes} folders={folders} error={error} />
        )}
        <AddTitle
          user={user}
          selectedCreate={selectedCreate}
          addTitleOpen={addTitleOpen}
          setAddTitleOpen={setAddTitleOpen}
          notes={notes}
          folders={folders}
          currentFolder={folder}
        />
        <DeleteModal
          deleteOpen={deleteOpen}
          setDeleteOpen={setDeleteOpen}
          type='folder'
          folder={folder?.data}
        />
        <MoveModal
          moveOpen={moveOpen}
          setMoveOpen={setMoveOpen}
          type='folder'
          folder={folder?.data}
          folders={folders}
        />
      </div>
    )
  );
};

export default Dashboard;
