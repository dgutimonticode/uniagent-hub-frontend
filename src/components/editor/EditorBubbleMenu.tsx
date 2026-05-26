import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Bold, Code2, Heading1, Heading2, Italic, Link2, Quote } from 'lucide-react';

interface EditorBubbleMenuProps {
  editor: Editor;
  readOnly?: boolean;
}

function BubbleButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-8 items-center justify-center rounded-md border px-2.5 text-[13px] transition-colors ${
        active
          ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
          : 'border-[var(--hairline-2)] bg-[var(--paper)] text-[var(--ink-2)] hover:border-[var(--ink-3)] hover:text-[var(--ink)]'
      }`}
    >
      {icon}
    </button>
  );
}

export function EditorBubbleMenu({ editor, readOnly }: EditorBubbleMenuProps) {
  if (readOnly) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Ingresá una URL', previousUrl ?? 'https://');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <BubbleMenu editor={editor}>
      <div className="flex items-center gap-1 rounded-[10px] border border-[var(--hairline)] bg-[var(--paper)] p-2 shadow-[0_12px_30px_rgba(31,29,26,0.12)]">
        <BubbleButton label="Negrita" icon={<Bold size={14} />} active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
        <BubbleButton label="Cursiva" icon={<Italic size={14} />} active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <BubbleButton label="Código inline" icon={<Code2 size={14} />} active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} />
        <BubbleButton label="Título 1" icon={<Heading1 size={14} />} active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
        <BubbleButton label="Título 2" icon={<Heading2 size={14} />} active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
        <BubbleButton label="Cita" icon={<Quote size={14} />} active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <BubbleButton label="Link" icon={<Link2 size={14} />} active={editor.isActive('link')} onClick={setLink} />
      </div>
    </BubbleMenu>
  );
}
