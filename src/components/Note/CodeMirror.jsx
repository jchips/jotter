import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { markdown as md } from '@codemirror/lang-markdown';
import { EditorView, placeholder, keymap } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';

/**
 * This component is to fix an bug where the cursor jumps to the top
 * of the editor at times when typing
 */
const CodeMirror = ({ value, onChange, placeholderText, ...rest }) => {
  const editorRef = useRef(null); // Reference to the editor DOM node
  const editorInstanceRef = useRef(null); // Reference to the editor instance
  const configs = useSelector((state) => state.configs.value);

  useEffect(() => {
    if (!editorRef.current) return;
    if (!editorInstanceRef.current) {
      editorInstanceRef.current = new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: [
            basicSetup({
              indentOnInput: true,
              highlightActiveLine: configs?.highlightActiveLine,
            }),
            md(),
            keymap.of([indentWithTab, { key: 'Mod-b', run: toggleBold() }]),
            placeholder(placeholderText),
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const newValue = update.state.doc.toString();
                onChange(newValue);
              }
            }),
          ],
          ...rest,
        }),
        parent: editorRef.current,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest, onChange]);

  useEffect(() => {
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={editorRef} className='editor' />;
};

// Toggle bold text in markdown
const toggleBold = () => (view) => {
  const { state } = view;
  const changes = state.changeByRange((range) => {
    const { from, to } = range;
    console.log('state', state);
    const selectedText = state.doc.slice(from, to).toString();
    let boldText = state.doc.slice(from - 2, to + 2).toString();

    // Check if selected text is already bold
    const isBold = boldText.startsWith('**') && boldText.endsWith('**');

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

export default CodeMirror;
