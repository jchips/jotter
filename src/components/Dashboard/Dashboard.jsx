import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useFolder } from '@/hooks/useFolder';
import { useMarkdown } from '@/hooks/useMarkdown';
import Loading from '../Loading';
import AddTitle from '../modals/AddTitle';
import DisplayNotes from './DisplayNotes';
import Navbar from '../Navbars/DashboardNav';
import DisplayFolders from './DisplayFolders';
import api from '@/util/api';
import './Dashboard.scss';

const Dashboard = () => {
  const [notes, setNotes] = useState();
  const [folders, setFolders] = useState();
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const { user, logout } = useAuth();
  const { setMarkdown } = useMarkdown();
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { pathState = {} } = useLocation();
  const { folder, childFolders, childFiles } = useFolder(
    folderId,
    pathState.folder
  );

  // let folder_id = folderId === undefined ? null : folderId;

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
        console.log('folders:', foldersRes.data); // delete later
        console.log('notes:', notesRes.data); // delete later
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

  if (loading) {
    return <Loading />;
  }

  const logUserOut = () => {
    navigate('/login');
    logout();
  };
  return (
    !loading && (
      <div className='dashboard'>
        <Navbar
          logout={logUserOut}
          setSelectedOption={setSelectedOption}
          setIsOpen={setIsOpen}
          setNotes={setNotes}
          setFolders={setFolders}
          currentFolder={folder?.data}
        />
        {folders && <DisplayFolders folders={folders} error={error} />}
        {notes && (
          <DisplayNotes notes={notes} folders={folders} error={error} />
        )}
        <AddTitle
          user={user}
          selectedOption={selectedOption}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          notes={notes}
          folders={folders}
          setNotes={setNotes}
          setFolders={setFolders}
          // folderId={folderId}
          currentFolder={folder}
        />
      </div>
    )
  );
};

export default Dashboard;
