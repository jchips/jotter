import React, { useRef, useEffect } from 'react';
import { markdown as md } from '@codemirror/lang-markdown';
import { EditorView, placeholder } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';

// This component is to fix an bug where the cursor jumps to the top of
// the editor at times when typing quickly
const CodeMirror = ({ value, onChange, placeholderText, ...rest }) => {
  const editorRef = useRef(null); // Reference to the editor DOM node
  const editorInstanceRef = useRef(null); // Reference to the editor instance

  useEffect(() => {
    if (!editorRef.current) return;
    if (!editorInstanceRef.current) {
      editorInstanceRef.current = new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: [
            basicSetup(),
            md(),
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

export default CodeMirror;
