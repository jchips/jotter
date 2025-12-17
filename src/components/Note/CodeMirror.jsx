import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { markdown as md } from '@codemirror/lang-markdown';
import { EditorView, placeholder, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import {
  toggleBold,
  toggleItalic,
  toggleStrike,
} from '@/util/markdownKeybinding';

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
            keymap.of([
              indentWithTab,
              { key: 'Mod-b', run: toggleBold() },
              { key: 'Mod-Shift-i', run: toggleItalic() },
              { key: 'Mod-Shift-x', run: toggleStrike() },
            ]),
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
