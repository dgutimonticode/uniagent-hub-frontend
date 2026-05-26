import { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorToolbar } from './EditorToolbar';
import { EditorBubbleMenu } from './EditorBubbleMenu';

interface NotionEditorProps {
  content: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
}

const lowlight = createLowlight(common);

export function NotionEditor({ content, onChange, readOnly = false }: NotionEditorProps) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        Placeholder.configure({
          placeholder: 'Comenzá a escribir...',
        }),
        Typography,
        CharacterCount.configure(),
        CodeBlockLowlight.configure({ lowlight }),
      ],
      content,
      editable: !readOnly,
      editorProps: {
        attributes: {
          class:
            'notion-editor prose prose-neutral max-w-none focus:outline-none prose-headings:font-serif prose-p:font-serif prose-li:font-serif prose-blockquote:border-l-[3px] prose-blockquote:border-[var(--accent)] prose-blockquote:pl-4 prose-blockquote:italic prose-code:rounded prose-code:bg-[var(--paper-2)] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-pre:bg-[var(--ink)]/5 prose-pre:border prose-pre:border-[var(--hairline)] prose-pre:rounded-[10px] prose-pre:px-4 prose-pre:py-3 prose-pre:font-mono prose-pre:text-[13px]',
        },
      },
      onUpdate: ({ editor: instance }) => {
        onChange(instance.getHTML());
      },
    },
    [content, readOnly, onChange]
  );

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === content) return;
    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  const wordCount = useMemo(() => {
    if (!editor) return 0;
    return editor.storage.characterCount.words();
  }, [editor]);

  const characterCount = editor?.storage.characterCount.characters() ?? 0;

  if (!editor) {
    return (
      <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] p-6 text-[13px] text-[var(--ink-3)]">
        Cargando editor…
      </div>
    );
  }

  if (readOnly) {
    return (
      <article className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] px-8 py-8 shadow-[0_1px_2px_rgba(31,29,26,0.03)] lg:px-12 lg:py-10">
        <EditorContent editor={editor} />
      </article>
    );
  }

  return (
    <div className="rounded-[12px] border border-[var(--hairline)] bg-[var(--paper)] shadow-[0_1px_2px_rgba(31,29,26,0.03)]">
      <div className="border-b border-[var(--hairline)] bg-[var(--paper-2)] p-3">
        <EditorToolbar editor={editor} readOnly={readOnly} />
      </div>

      <div className="relative px-5 py-5">
        <EditorBubbleMenu editor={editor} readOnly={readOnly} />
        <EditorContent editor={editor} />

        <div className="mt-6 flex items-center justify-end gap-3 font-mono text-[10.5px] tracking-[0.04em] text-[var(--ink-3)]">
          <span>{wordCount} palabras</span>
          <span>·</span>
          <span>{characterCount} caracteres</span>
        </div>
      </div>
    </div>
  );
}
