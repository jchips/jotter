import { Grid } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import FolderCard from './FolderCard';

const DisplayFolders = ({ folders, error }) => {
  return folders.length !== 0 ? (
    <div className='display'>
      {error ? (
        <div>
          <Alert status='error' title={error} />
        </div>
      ) : null}
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        {folders.map((folder) => (
          <FolderCard folder={folder} key={folder.id} />
        ))}
      </Grid>
    </div>
  ) : null;
};

export default DisplayFolders;
