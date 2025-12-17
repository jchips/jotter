import { EditorSelection } from '@codemirror/state';

/**
 * Toggle bold text in markdown
 * @returns {Object | boolean} - returns changes to markdown text (or `true` if error occurs).
 */
const toggleBold = () => (view) => {
  const { state } = view;
  const changes = state.changeByRange((range) => {
    const { from, to } = range;
    const selectedText = state.doc.slice(from, to).toString();
    let boldText = state.doc.slice(from - 2, to + 2).toString();

    // Check if selected text is already bold
    const isBold = boldText.startsWith('**') && boldText.endsWith('**') ||
      (boldText.startsWith('__') && boldText.endsWith('__'));;

    let newText = '';
    let insertFrom = from;
    let insertTo = to;

    if (isBold) {
      insertFrom = from - 2;
      newText = boldText.slice(2, -2);
      insertTo = from - 2 + boldText.length;
    } else {
      newText = `**${selectedText || 'bold text'}**`;
    }

    return {
      changes: { from: insertFrom, to: insertTo, insert: newText },
      range: EditorSelection.range(
        insertFrom + (isBold ? 0 : 2),
        insertFrom + newText.length - (isBold ? 0 : 2)
      ),
    };
  });

  view.dispatch(changes);
  return true;
};

/**
 * Toggle italic text in markdown
 * @returns {Object | boolean} - returns changes to markdown text (or `true` if error occurs).
 */
const toggleItalic = () => (view) => {
  const { state } = view;
  const changes = state.changeByRange((range) => {
    const { from, to } = range;
    const selectedText = state.doc.slice(from, to).toString();
    let italicText = state.doc.slice(from - 1, to + 1).toString();

    // Check if selected text is already italic
    const isItalic =
      (italicText.startsWith('*') && italicText.endsWith('*')) ||
      (italicText.startsWith('_') && italicText.endsWith('_'));

    let newText = '';
    let insertFrom = from;
    let insertTo = to;

    if (isItalic) {
      insertFrom = from - 1;
      newText = italicText.slice(1, -1);
      insertTo = from - 1 + italicText.length;
    } else {
      newText = `*${selectedText || 'italic text'}*`;
    }

    return {
      changes: { from: insertFrom, to: insertTo, insert: newText },
      range: EditorSelection.range(
        insertFrom + (isItalic ? 0 : 1),
        insertFrom + newText.length - (isItalic ? 0 : 1)
      ),
    };
  });

  view.dispatch(changes);
  return true;
};

/**
 * Toggle strikethough text in markdown
 * @returns {Object | boolean} - returns changes to markdown text (or `true` if error occurs).
 */
const toggleStrike = () => (view) => {
  const { state } = view;
  const changes = state.changeByRange((range) => {
    const { from, to } = range;
    const selectedText = state.doc.slice(from, to).toString();
    let strikedText = state.doc.slice(from - 2, to + 2).toString();

    // Check if selected text is already striked through
    const isStriked =
      strikedText.startsWith('~~') && strikedText.endsWith('~~');

    let newText = '';
    let insertFrom = from;
    let insertTo = to;

    if (isStriked) {
      insertFrom = from - 2;
      newText = strikedText.slice(2, -2);
      insertTo = from - 2 + strikedText.length;
    } else {
      newText = `~~${selectedText || 'striked out text'}~~`;
    }

    return {
      changes: { from: insertFrom, to: insertTo, insert: newText },
      range: EditorSelection.range(
        insertFrom + (isStriked ? 0 : 2),
        insertFrom + newText.length - (isStriked ? 0 : 2)
      ),
    };
  });

  view.dispatch(changes);
  return true;
};

export { toggleBold, toggleItalic, toggleStrike };