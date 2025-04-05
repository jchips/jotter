import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Button } from '@chakra-ui/react';
import { formatDate2 } from '@/util/formatDate';
import api from '@/util/api';

const ExportAllButton = ({ setError }) => {
  /**
   * Fetches all the folders and notes that are inside the given folder
   * @param {Number} folder_id - The current folder id
   * @returns {Object} - All folders and notes that are children of the current folder
   */
  const fetchAll = async (folder_id) => {
    try {
      setError('');
      const [foldersRes, notesRes] = await Promise.all([
        api.getFolders(folder_id),
        folder_id ? api.getNotes(folder_id) : api.getRootNotes(),
      ]);
      return { foldersRes: foldersRes.data, notesRes: notesRes.data };
    } catch (err) {
      console.error(
        `Failed to fetch folders and notes for folder id ${folder_id}: - `,
        err
      );
      setError('Failed to export');
    }
    return {};
  };

  /**
   * Fetches all folders and their notes recursively
   * @param {JSZip} zip - A (zip) folder
   * @param {Object[]} folders - All the folders
   * @param {Object[]} notes - All the notes
   */
  const recursiveFetch = async (zip, folders, notes) => {
    if (notes && notes.length > 0) {
      notes.forEach((note) => {
        zip.file(note.title + '.md', note.content);
      });
    }
    if (folders && folders.length > 0) {
      for (const folder of folders) {
        let { foldersRes, notesRes } = await fetchAll(folder.id);
        const subFolderZip = zip.folder(folder.title);
        await recursiveFetch(subFolderZip, foldersRes, notesRes);
      }
    }
  };

  /**
   * Exports all folders and notes that belong to user.
   * Starts by fetching all the root folders and notes.
   */
  const handleExport = async () => {
    let { foldersRes, notesRes } = await fetchAll(null);
    let date = new Date();
    const zip = new JSZip();
    await recursiveFetch(zip, foldersRes, notesRes);
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, formatDate2(date));
  };

  return (
    <Button onClick={handleExport} className='button1'>
      Export All
    </Button>
  );
};

export default ExportAllButton;
