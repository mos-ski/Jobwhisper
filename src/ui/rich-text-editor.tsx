import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Underline as UnderlineIcon,
} from 'lucide-react'
import { cn } from './cn'

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  label,
}: {
  readonly onClick: () => void
  readonly active?: boolean
  readonly disabled?: boolean
  readonly children: React.ReactNode
  readonly label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-40',
        active && 'bg-accent-subtle text-accent',
      )}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { readonly editor: Editor }) {
  function addLink() {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  function addImage() {
    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
      <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} label="Paragraph">
        <Pilcrow className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} label="Heading 1">
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="Heading 2">
        <Heading2 className="size-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="Bold">
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="Italic">
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} label="Underline">
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} label="Code">
        <Code className="size-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="Bullet list">
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="Ordered list">
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
      <ToolbarButton onClick={addLink} active={editor.isActive('link')} label="Add link">
        <LinkIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} label="Add image">
        <ImagePlus className="size-4" />
      </ToolbarButton>
    </div>
  )
}

export type RichTextEditorProps = {
  readonly value: string
  readonly onChange: (html: string) => void
  readonly placeholder?: string
  readonly className?: string
  readonly id?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Write your message...', className, id }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div id={id} className={cn('overflow-hidden rounded-lg border border-border bg-surface', className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-[12rem] px-4 py-3 text-sm leading-6 text-ink focus-visible:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror_h1]:font-gowun [&_.ProseMirror_h1]:text-xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:text-ink [&_.ProseMirror_h2]:font-gowun [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:text-ink [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_ul]:mb-2 [&_.ProseMirror_ul]:ps-6 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ol]:mb-2 [&_.ProseMirror_ol]:ps-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_li]:mb-0.5 [&_.ProseMirror_a]:text-accent [&_.ProseMirror_a]:underline [&_.ProseMirror_img]:my-3 [&_.ProseMirror_img]:max-h-48 [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_pre]:mb-2 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:bg-surface-subtle [&_.ProseMirror_pre]:p-3 [&_.ProseMirror_code]:rounded bg-surface-subtle px-1 py-0.5 text-sm [&_.ProseMirror_is-empty]:before:pointer-events-none [&_.ProseMirror_is-empty]:before:float-left [&_.ProseMirror_is-empty]:before:h-0 [&_.ProseMirror_is-empty]:before:text-ink-muted/50 [&_.ProseMirror_is-empty]:before:content-[attr(data-placeholder)]" />
    </div>
  )
}
