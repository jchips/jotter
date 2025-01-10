/**
 * Sorts the user's notes and folders by their chosen sort value
 * @param {String} value - Chosen sort value
 * @param {Object} sortMethod - the sort methods object
 * @param {Object[]} notes - The user's notes
 * @param {Object[]} folders - The user's folders
 * @param {Function} sortNotes - Sets the user's notes (once sorted)
 * @param {Function} sortFolders - Sets the user's folders (once sorted)
 */
const sortBy = (value, sortMethod, notes, folders, sortNotes, sortFolders) => {
  let sortedNotes;
  let sortedFolders;
  switch (value) {
    case '1':
      sortedNotes = sortMethod.sortByCreatedAsc(notes);
      sortedFolders = sortMethod.sortByCreatedAsc(folders);
      break;
    case '2':
      sortedNotes = sortMethod.sortByCreatedDesc(notes);
      sortedFolders = sortMethod.sortByCreatedDesc(folders);
      break;
    case '3':
      sortedNotes = sortMethod.sortByTitleDesc(notes);
      sortedFolders = sortMethod.sortByTitleDesc(folders);
      break;
    case '4':
      sortedNotes = sortMethod.sortByTitleAsc(notes);
      sortedFolders = sortMethod.sortByTitleAsc(folders);
      break;
    case '6':
      sortedNotes = sortMethod.sortByUpdatedDesc(notes);
      sortedFolders = sortMethod.sortByUpdatedDesc(folders);
      break;
    case '5':
      sortedNotes = sortMethod.sortByUpdatedAsc(notes);
      sortedFolders = sortMethod.sortByUpdatedAsc(folders);
      break;
    default:
      sortedNotes = sortMethod.sortByCreatedAsc(notes);
      sortedFolders = sortMethod.sortByCreatedAsc(folders);
      break;
  }
  sortNotes(sortedNotes);
  sortFolders(sortedFolders);
};

export default sortBy;