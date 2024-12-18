import { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '../Navbars/DashboardNav';
import Loading from '../Loading';
import DisplayNotes from './DisplayNotes';
import AddNoteTitle from '../modals/AddNoteTitle';
import api from '@/util/api';
import './Dashboard.scss';

const Dashboard = () => {
  const [notes, setNotes] = useState();
  const [folders, setFolders] = useState();
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchRootNotes = async () => {
      try {
        setError('');
        let res = await api.getRootNotes();
        console.log('root notes:', res.data); // delete later
        setNotes(res.data);
      } catch (err) {
        console.error(err);
        err.response.data.message === 'jwt expired'
          ? logout()
          : setError('Could not fetch notes');
      }
    };
    fetchRootNotes();
    setLoading(false);
  }, [logout]);

  if (!notes) {
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
        />
        <DisplayNotes notes={notes} error={error} logout={logUserOut} />
        <AddNoteTitle
          user={user}
          selectedOption={selectedOption}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          notes={notes}
          setNotes={setNotes}
          setFolders={setFolders}
        />
      </div>
    )
  );
};

export default Dashboard;
