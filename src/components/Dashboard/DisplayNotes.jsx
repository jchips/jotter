import { useEffect, useState } from 'react';
import { Button, Grid } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import NoteCard from './NoteCard';

const DisplayNotes = ({ notes, folders, error }) => {
  const { width } = useWindowDimensions();
  return (
    <div>
      {notes.length === 0 && folders.length === 0 ? (
        <div className='display'>
          <p>No notes.</p>
        </div>
      ) : (
        <div className='display'>
          {error ? (
            <div>
              <Alert status='error' title={error} />
            </div>
          ) : null}
          <Grid
            templateColumns={width > 768 ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
            gap={width > 768 ? 6 : 2}
          >
            {notes.map((note) => (
              <NoteCard note={note} key={note.id} />
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default DisplayNotes;
