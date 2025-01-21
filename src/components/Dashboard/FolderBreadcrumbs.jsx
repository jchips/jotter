import { Link } from 'react-router';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '@/components/ui/breadcrumb';
import { ROOT_FOLDER } from '../../hooks/useFolder';

const FolderBreadcrumbs = ({ currentFolder }) => {
  currentFolder = currentFolder?.data || currentFolder;
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  let parsedPath =
    typeof currentFolder.path === 'string'
      ? JSON.parse(currentFolder.path)
      : currentFolder.path;
  let currentFolderPath = currentFolder !== ROOT_FOLDER ? parsedPath : path; // parse from db
  if (currentFolder) path = [...path, ...currentFolderPath];
  return (
    <BreadcrumbRoot className='breadcrumb'>
      {path.map((folder, index) => (
        <BreadcrumbLink asChild key={index}>
          <Link
            to={{
              pathname: folder.id ? `/folder/${folder.id}` : '/',
            }}
            state={{ folder: { ...folder, path: path.slice(1, index) } }}
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

export default FolderBreadcrumbs;
