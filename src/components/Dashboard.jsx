import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
// import Note from './Note/Note';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logUserOut = () => {
    navigate('/login');
    logout();
  };
  return (
    <div>
      <p>Dashboard</p>
      <Button onClick={() => navigate('/editor')}>Editor</Button>
      <Button onClick={() => navigate('/preview')}>Preview</Button>
      <Button onClick={logUserOut}>Log out</Button>
    </div>
  );
};

export default Dashboard;
