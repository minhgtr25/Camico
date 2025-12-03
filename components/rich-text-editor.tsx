'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="border-2 border-gray-300 rounded-lg px-4 py-3 min-h-[200px] bg-gray-50 animate-pulse">
        <p className="text-gray-400">Đang tải editor...</p>
      </div>
    )
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link'
  ]

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Nhập nội dung...'}
        className="bg-white rounded-lg"
      />
      <style jsx global>{`
        .rich-text-editor-wrapper .quill {
          border-radius: 0.5rem;
          border: 2px solid #d1d5db;
        }
        .rich-text-editor-wrapper .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-size: 15px;
          font-family: system-ui, -apple-system, sans-serif;
          min-height: 200px;
        }
        .rich-text-editor-wrapper .ql-editor {
          min-height: 200px;
          font-size: 15px;
          line-height: 1.6;
        }
        .rich-text-editor-wrapper .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .rich-text-editor-wrapper .ql-snow .ql-stroke {
          stroke: #4b5563;
        }
        .rich-text-editor-wrapper .ql-snow .ql-fill {
          fill: #4b5563;
        }
        .rich-text-editor-wrapper .ql-snow .ql-picker-label {
          color: #4b5563;
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover,
        .rich-text-editor-wrapper .ql-toolbar button:focus,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label:hover,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label.ql-active {
          color: #2d5016;
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label.ql-active .ql-stroke {
          stroke: #2d5016;
        }
        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button:focus .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label.ql-active .ql-fill {
          fill: #2d5016;
        }
      `}</style>
    </div>
  )
}
