import { Grid } from '@chakra-ui/react';
import { Alert } from '@/components/ui/alert';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import FolderCard from './FolderCard';

const DisplayFolders = ({ folders, error }) => {
  const { width } = useWindowDimensions();
  return folders.length !== 0 ? (
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
        {folders.map((folder) => (
          <FolderCard folder={folder} key={folder.id} />
        ))}
      </Grid>
    </div>
  ) : null;
};

export default DisplayFolders;
