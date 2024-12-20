import { useEffect, useState } from 'react';
import { Button, Grid } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import NoteCard from './NoteCard';

const DisplayNotes = ({ notes, error }) => {
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
        <div className='display'>
          <p>No notes.</p>
        </div>
      )}
    </div>
  );
};

export default DisplayNotes;
