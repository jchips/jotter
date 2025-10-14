import { Link } from 'react-router'
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '@/components/ui/breadcrumb'
import { ROOT_FOLDER } from '../../hooks/useFolder'
import { useState, useEffect, useMemo } from 'react'
import { getFolderTitle } from '@/util/getFolderTitle'
import Loading from '../Loading'

const FolderBreadcrumbs = ({ currentFolder }) => {
  currentFolder = currentFolder?.data || currentFolder

  const path = useMemo(() => {
    const basePath = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER]
    const parsedPath =
      typeof currentFolder.path === 'string'
        ? JSON.parse(currentFolder.path)
        : currentFolder.path
    const currentFolderPath =
      currentFolder !== ROOT_FOLDER ? parsedPath : basePath // parse from db
    return currentFolder ? [...basePath, ...currentFolderPath] : basePath
  }, [currentFolder])

  const [foldersInPath, setFoldersInPath] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFolderTitles = async () => {
      try {
        setLoading(true)
        const responses = await Promise.all(
          path.map(async (pathItem) => {
            if (pathItem.id !== null) {
              let res = await getFolderTitle(pathItem.id)
              return { id: pathItem.id, title: res }
            } else {
              return { id: null, title: 'Home' }
            }
          })
        )
        setFoldersInPath(responses)
      } catch (err) {
        console.error('Failed to fetch folder title:', err)
      }
    }
    if (path?.length) fetchFolderTitles()
    setLoading(false)
  }, [path])

  return (
    <BreadcrumbRoot className='breadcrumb'>
      {foldersInPath.map((folder, index) => (
        <BreadcrumbLink asChild key={index}>
          <Link
            to={{
              pathname: folder?.id ? `/folder/${folder?.id}` : '/',
            }}
            state={{
              folder: { ...folder, path: foldersInPath.slice(1, index) },
            }}
          >
            {folder?.title}
          </Link>
        </BreadcrumbLink>
      ))}
      {currentFolder && (
        <BreadcrumbCurrentLink>{currentFolder.title}</BreadcrumbCurrentLink>
      )}
    </BreadcrumbRoot>
  )
}

export default FolderBreadcrumbs
