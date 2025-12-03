'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none px-4 py-3',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors font-bold ${
            editor.isActive('bold') ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="In đậm (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors italic ${
            editor.isActive('italic') ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors underline ${
            editor.isActive('underline') ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Gạch chân (Ctrl+U)"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors line-through ${
            editor.isActive('strike') ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Gạch ngang"
        >
          S
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors font-bold ${
            editor.isActive('heading', { level: 2 }) ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Tiêu đề 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors font-bold ${
            editor.isActive('heading', { level: 3 }) ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Tiêu đề 3"
        >
          H3
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('bulletList') ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Danh sách"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive('orderedList') ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Danh sách số"
        >
          1. List
        </button>
        <div className="w-px bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Căn trái"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Căn giữa"
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-green-100 text-green-800' : 'bg-white'
          }`}
          title="Căn phải"
        >
          →
        </button>
      </div>
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
        className="min-h-[200px]"
      />
      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
          font-size: 15px;
          line-height: 1.6;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror u {
          text-decoration: underline;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 700;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 700;
          margin-top: 0.8em;
          margin-bottom: 0.4em;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 2em;
          margin: 1em 0;
        }
        .ProseMirror li {
          margin: 0.5em 0;
        }
        .ProseMirror p {
          margin: 0.75em 0;
        }
      `}</style>
    </div>
  )
}
