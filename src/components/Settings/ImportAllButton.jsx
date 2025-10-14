import React, { useState } from 'react'
import JSZip from 'jszip'
import api from '@/util/api'
import { useAuth } from '@/hooks/useAuth'
import Loading from '../Loading'

const ImportAllButton = ({ setError }) => {
  const [importing, setImporting] = useState(false)
  const { user } = useAuth()

  const handleImport = async (e) => {
    e.preventDefault()
    setImporting(true)
    setError('')
    const zipFile = e.target.files?.[0]
    if (!zipFile) return // exit if no note
    try {
      const zip = await JSZip.loadAsync(zipFile)
      const allNotesAndFoldersInZip = []

      // Loop through every note/folder in zip
      zip.forEach((relativePath, zipEntry) => {
        allNotesAndFoldersInZip.push(zipEntry)
      })

      // create outer folders before nested content (this is important)
      allNotesAndFoldersInZip.sort((a, b) => a.name.localeCompare(b.name))

      let pathToId = {}

      for (const entry of allNotesAndFoldersInZip) {
        const { name, dir } = entry
        const parts = name.split('/').filter(Boolean)

        // A folder
        if (dir) {
          if (parts.length === 0) return
          const folderName = parts.pop() || parts[0]
          const parentPath = parts.join('/') // for pathToId
          const parentId = pathToId[parentPath] || null

          let res = await api.addFolder({
            title: folderName,
            userId: user.id,
            parentId: parentId,
            path: [],
          })

          let folderId = res.data.id
          pathToId[entry.name.replace(/\/$/, '')] = folderId

          let folderPath = []
          let pathToParentsArr = []
          parts.forEach((part) => {
            pathToParentsArr.push(part)
            let pathToParents = pathToParentsArr.join('/')
            let nestedFolderId = pathToId[pathToParents]
            folderPath = [...folderPath, { id: nestedFolderId }]
          })

          if (folderPath.length > 0) {
            let res2 = await api.updateFolder(
              {
                path: folderPath,
              },
              folderId
            )
          }

          // A note
        } else if (name.endsWith('.md')) {
          const noteTitle = parts.pop().slice(0, -3)
          const folderPath = parts.join('/')
          const parentId = pathToId[folderPath] || null
          const noteContent = await entry.async('string')
          let res = await api.addNote({
            title: noteTitle,
            content: noteContent,
            userId: user.id,
            folderId: parentId,
          })
        }
      }

      alert('Import successful!')
    } catch (err) {
      console.error('Failed to import:', err)
      setError('Import failed')
    } finally {
      setImporting(false)
    }
  }

  if (importing) {
    return <Loading />
  }

  return (
    <label
      style={{
        cursor: 'pointer',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 500,
      }}
      className='button1'
    >
      <input
        type='file'
        accept='.zip'
        style={{ display: 'none' }}
        onChange={handleImport}
      />
      Import ZIP
    </label>
  )
}

export default ImportAllButton
