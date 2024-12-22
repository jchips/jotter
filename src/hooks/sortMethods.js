const sortMethods = {

  // Most recently created note/folder
  sortByCreatedAsc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.createdAt);
      const date2 = new Date(b.createdAt);
      return date2 - date1;
    });
    return dataCopy;
  },

  // Oldest note/folder at top
  sortByCreatedDesc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.createdAt);
      const date2 = new Date(b.createdAt);
      return date1 - date2;
    });
    return dataCopy;
  },

  // Most recently edited note/folder
  sortByUpdatedAsc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.updatedAt);
      const date2 = new Date(b.updatedAt);
      return date2 - date1;
    });
    return dataCopy;
  },

  // Oldest updates at top
  sortByUpdatedDesc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const date1 = new Date(a.updatedAt);
      const date2 = new Date(b.updatedAt);
      return date1 - date2;
    });
    return dataCopy;
  },

  /**
   * Sort by title AZ
   * Sorts numbers and letters
   * (ex: 12, 2a, a1, a2, a12, abc, b, b4)
   */
  sortByTitleDesc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const parseString = (str) => {
        const match = String(str).match(/([a-zA-Z]*)(\d*)/) || [];
        const letter = match[1] || ''; // Letters part
        const number = match[2] ? Number(match[2]) : null; // Numbers part (convert to number if present)
        return { letter, number };
      };

      const parsedA = parseString(a.title);
      const parsedB = parseString(b.title);

      // Compare letters
      if (parsedA.letter !== parsedB.letter) {
        return parsedA.letter.localeCompare(parsedB.letter);
      }

      // If letters are the same and both lack numbers, sort alphabetically
      // may not need this
      if (parsedA.number === null && parsedB.number === null) {
        return a.localeCompare(b);
      }

      // If letters are the same and both have numbers, compare numbers
      if (parsedA.number !== null && parsedB.number !== null) {
        return parsedA.number - parsedB.number;
      }

      // Handle cases where one has no number
      if (parsedA.number === null && parsedB.number !== null) {
        return 1; // `a` has no number, so it should come after
      }
      if (parsedB.number === null && parsedA.number !== null) {
        return -1; // `b` has no number, so it should come after
      }

      // Default to equal (should not reach this point)
      return 0;
    });
    return dataCopy;
  },

  /**
   * Sort by title ZA
   * Sorts numbers and letters
   */
  sortByTitleAsc: (data) => {
    let dataCopy = [...data];
    dataCopy.sort((a, b) => {
      const parseString = (str) => {
        const match = String(str).match(/([a-zA-Z]*)(\d*)/) || [];
        const letter = match[1] || ''; // Letters part
        const number = match[2] ? Number(match[2]) : null; // Numbers part
        return { letter, number };
      };

      const parsedA = parseString(a.title);
      const parsedB = parseString(b.title);

      // Compare letters
      if (parsedA.letter !== parsedB.letter) {
        if (parsedA.letter > parsedB.letter) {
          return -1;
        } else {
          return 1;
        }
      }
      // May not need this
      if (parsedA.number === null && parsedB.number === null) {
        if (parsedA.letter > parsedB.letter) {
          return -1;
        } else {
          return 1;
        }
      }

      if (parsedA.number !== null && parsedB.number !== null) {
        return parsedA.number - parsedB.number;
      }

      if (parsedA.number === null && parsedB.number !== null) {
        return 1; // `a` has no number, so it should come after
      }
      if (parsedB.number === null && parsedA.number !== null) {
        return -1; // `b` has no number, so it should come after
      }

      return 0;
    })
    return dataCopy;
  }
}

export default sortMethods;