import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useFolder } from '@/hooks/useFolder';
import { useMarkdown } from '@/hooks/useMarkdown';
import Loading from '../Loading';
import AddTitle from '../modals/AddTitle';
import DisplayNotes from './DisplayNotes';
import Navbar from '../Navbars/Navbar';
import DisplayFolders from './DisplayFolders';
import DeleteModal from '../modals/DeleteModal';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import api from '@/util/api';
import './Dashboard.scss';
import MoveModal from '../modals/MoveModal';

const Dashboard = () => {
  const [notes, setNotes] = useState();
  const [folders, setFolders] = useState();
  const [error, setError] = useState('');
  const [addTitleOpen, setAddTitleOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCreate, setSelectedCreate] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const { user, logout } = useAuth();
  const { setMarkdown } = useMarkdown();
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { pathState = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(
    folderId,
    pathState.folder
  );

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
        setFolders(foldersRes.data);
        setNotes(notesRes.data);
      } catch (err) {
        console.error(err);
        if (err.response?.data?.message === 'jwt expired') {
          logout();
        } else {
          setError('Could not fetch content');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [logout, setMarkdown, folderId]);

  // Loading circle
  if (loading) {
    return <Loading />;
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
          setNotes={setNotes}
          setFolders={setFolders}
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
          setNotes={setNotes}
          setFolders={setFolders}
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
