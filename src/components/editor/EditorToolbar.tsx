import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Italic,
  Link2,
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: Editor;
  readOnly?: boolean;
}

interface ToolbarButtonProps {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

function ToolbarButton({ active, disabled, onClick, label, icon }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md border px-2.5 text-[13px] transition-colors',
        active
          ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
          : 'border-[var(--hairline-2)] bg-[var(--paper)] text-[var(--ink-2)] hover:border-[var(--ink-3)] hover:text-[var(--ink)]',
        disabled && 'cursor-not-allowed opacity-40'
      )}
    >
      {icon}
    </button>
  );
}

export function EditorToolbar({ editor, readOnly }: EditorToolbarProps) {
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
    <div className="flex flex-wrap items-center gap-1 rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-2)] p-2">
      <ToolbarButton
        label="Negrita"
        icon={<Bold size={14} />}
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Cursiva"
        icon={<Italic size={14} />}
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Código inline"
        icon={<Code2 size={14} />}
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <span className="mx-1 h-5 w-px bg-[var(--hairline-2)]" />
      <ToolbarButton
        label="Título 1"
        icon={<Heading1 size={14} />}
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        label="Título 2"
        icon={<Heading2 size={14} />}
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="Lista desordenada"
        icon={<List size={14} />}
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Lista ordenada"
        icon={<ListOrdered size={14} />}
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="Bloque de cita"
        icon={<Quote size={14} />}
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="Link"
        icon={<Link2 size={14} />}
        active={editor.isActive('link')}
        onClick={setLink}
        disabled={readOnly}
      />
    </div>
  );
}
