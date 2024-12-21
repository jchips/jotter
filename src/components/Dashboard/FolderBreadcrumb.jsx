import { Link } from 'react-router';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '@/components/ui/breadcrumb';
import { ROOT_FOLDER } from '../../hooks/useFolder';

const FolderBreadcrumb = ({ currentFolder }) => {
  currentFolder = currentFolder?.data || currentFolder;
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  let currentFolderPath =
    currentFolder !== ROOT_FOLDER ? JSON.parse(currentFolder.path) : path; // parse from db
  if (currentFolder) path = [...path, ...currentFolderPath];
  return (
    <BreadcrumbRoot className='breadcrumb'>
      {path.map((folder, index) => (
        <BreadcrumbLink asChild key={index}>
          <Link
            to={{
              pathname: folder.id ? `/folder/${folder.id}` : '/',
              pathState: { folder: { ...folder, path: path.slice(1, index) } },
            }}
          >
            {folder.title}
          </Link>
        </BreadcrumbLink>
      ))}
      {currentFolder && (
        <BreadcrumbCurrentLink>{currentFolder.title}</BreadcrumbCurrentLink>
      )}
    </BreadcrumbRoot>
  );
};

export default FolderBreadcrumb;
