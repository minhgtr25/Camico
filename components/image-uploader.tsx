'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
}

export function ImageUploader({
  value,
  onChange,
  label = 'Hình ảnh',
  placeholder = 'URL hình ảnh hoặc upload file',
  className = '',
}: Readonly<ImageUploaderProps>) {
  const [uploading, setUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: '⚠️ File không hợp lệ',
        description: 'Vui lòng chọn file ảnh (jpg, png, gif, webp)',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: '⚠️ File quá lớn',
        description: 'Vui lòng chọn ảnh nhỏ hơn 10MB',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)

    try {
      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      onChange(url)
      toast({
        title: '✅ Upload thành công',
        description: 'Ảnh đã được tải lên Cloudinary',
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: '❌ Upload thất bại',
        description: 'Vui lòng thử lại',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClear = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Preview */}
        {value && (
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 bg-[#2d5016] hover:bg-[#3d6826] text-white"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            variant="outline"
            className="flex-1"
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            {showUrlInput ? 'Ẩn URL' : 'Nhập URL'}
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* URL input (toggle) */}
        {showUrlInput && (
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
        )}
      </div>
    </div>
  )
}
