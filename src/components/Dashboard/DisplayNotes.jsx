import { useEffect, useState } from 'react';
import { Button, Grid } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
// import Loading from '../Loading';
import NoteCard from './NoteCard';
// import api from '@/util/api';

const DisplayNotes = ({ notes, error }) => {
  // const [notes, setNotes] = useState();
  // const [error, setError] = useState('');

  // useEffect(() => {
  //   const fetchRootNotes = async () => {
  //     try {
  //       setError('');
  //       let res = await api.getRootNotes();
  //       console.log('root notes:', res.data); // delete later
  //       setNotes(res.data);
  //     } catch (err) {
  //       console.error(err);
  //       err.response.data.message === 'jwt expired'
  //         ? logout()
  //         : setError('Could not fetch notes');
  //     }
  //   };
  //   fetchRootNotes();
  // }, [logout]);

  // if (!notes) {
  //   return <Loading />;
  // }

  return (
    <div>
      {notes.length !== 0 ? (
        <div className='display'>
          {error ? (
            <div>
              <Alert status='error' title={error} />
            </div>
          ) : null}
          <Grid templateColumns='repeat(3, 1fr)' gap={6}>
            {notes.map((note) => (
              <NoteCard note={note} key={note.id} />
            ))}
          </Grid>
        </div>
      ) : (
        <p>No notes.</p>
      )}
    </div>
  );
};

export default DisplayNotes;
