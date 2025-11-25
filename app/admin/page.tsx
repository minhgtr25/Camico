'use client'

import { useState, useEffect } from 'react'
import { AdminContent } from '@/lib/types'
import { fetchAdminContentFromServer, saveAdminContentToServer, resetAdminContentOnServer, defaultAdminContent } from '@/lib/admin-content'
import { newsArticles as fallbackNews } from '@/lib/news-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageUploader } from '@/components/image-uploader'
import { useToast } from '@/hooks/use-toast'

type TabType = 'hero' | 'contact' | 'products' | 'news' | 'faqs' | 'pages' | 'about' | 'testimonials' | 'gallery' | 'guide'

export default function AdminPanel() {
  const [adminContent, setAdminContent] = useState<AdminContent>(defaultAdminContent)
  const [activeTab, setActiveTab] = useState<TabType>('hero')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load content from server on mount and merge with fallback news
    async function loadContent() {
      setIsLoading(true)
      try {
        const stored = await fetchAdminContentFromServer()

        // Merge fallback news with stored admin.news so admin can edit all frontend articles.
        const map = new Map<number, any>()
        for (const a of fallbackNews) map.set(a.id, { ...a, featured: Boolean((a as any).featured) })
        if (stored?.news && Array.isArray(stored.news)) {
          for (const a of stored.news) map.set(a.id, { ...(map.get(a.id) ?? a), ...a })
        }
        const mergedNews = Array.from(map.values())

        // Ensure home.newsHighlights includes any highlights from fallback if missing
        const homeHighlights = stored?.pages?.home?.newsHighlights ?? []
        const fallbackHighlights = fallbackNews
          .filter((a) => Boolean((a as any).featured) && !homeHighlights.some((h: any) => h.id === a.id))
          .map((a) => ({ ...a, featured: true }))

        const mergedContent: AdminContent = {
          ...stored,
          news: mergedNews,
          pages: {
            ...stored.pages,
            home: {
              ...stored.pages.home,
              newsHighlights: [...homeHighlights, ...fallbackHighlights],
            },
          },
        }

        setAdminContent(mergedContent)
      } catch (e) {
        console.error('Error loading admin content from server:', e)
        toast({
          title: 'Lỗi tải dữ liệu',
          description: 'Không thể tải dữ liệu từ server. Sử dụng dữ liệu mặc định.',
          variant: 'destructive',
        })
        setAdminContent(defaultAdminContent)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - change this to your admin password
    if (password === 'admin123') {
      setIsAuthenticated(true)
      toast({
        title: '✅ Đăng nhập thành công',
        description: 'Chào mừng đến Admin Panel',
      })
    } else {
      toast({
        title: '❌ Mật khẩu không đúng',
        description: 'Vui lòng thử lại',
        variant: 'destructive',
      })
      setPassword('')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const success = await saveAdminContentToServer(adminContent)
      if (success) {
        setUnsavedChanges(false)
        toast({
          title: '✅ Đã lưu thành công',
          description: 'Nội dung đã được cập nhật trên server',
        })
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: '❌ Lỗi lưu dữ liệu',
        description: 'Không thể lưu dữ liệu lên server. Vui lòng thử lại.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = async () => {
    if (confirm('Bạn chắc chắn muốn khôi phục nội dung mặc định?')) {
      setIsSaving(true)
      try {
        const success = await resetAdminContentOnServer()
        if (success) {
          setAdminContent(defaultAdminContent)
          setUnsavedChanges(false)
          toast({
            title: '🔄 Đã khôi phục',
            description: 'Nội dung đã được đặt lại về mặc định trên server',
          })
        } else {
          throw new Error('Reset failed')
        }
      } catch (error) {
        console.error('Error resetting content:', error)
        toast({
          title: '❌ Lỗi khôi phục',
          description: 'Không thể khôi phục dữ liệu. Vui lòng thử lại.',
          variant: 'destructive',
        })
      } finally {
        setIsSaving(false)
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2d5016] via-[#3d6826] to-[#4a7a2e] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl w-full max-w-md backdrop-blur-sm bg-opacity-95">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2d5016] rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-2">Admin Panel</h1>
            <p className="text-gray-600 text-sm">CAMICO - Quản lý nội dung</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[#2d5016] focus:ring-2 focus:ring-[#2d5016] focus:ring-opacity-20 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2d5016] hover:bg-[#3d6826] text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Đăng Nhập
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#2d5016] mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2d5016] to-[#3d6826] text-white sticky top-0 z-40 shadow-xl border-b-4 border-[#4a7a2e]">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Admin Panel</h1>
              <p className="text-xs text-white/70 hidden sm:block">CAMICO</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className={`${unsavedChanges ? 'bg-yellow-500 hover:bg-yellow-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white font-bold flex-1 sm:flex-none transition-all disabled:opacity-50`}
            >
              <span className="hidden sm:inline">
                {isSaving ? '⏳ Đang lưu...' : unsavedChanges ? '💾 Lưu Thay Đổi' : '✓ Đã Lưu'}
              </span>
              <span className="sm:hidden">
                {isSaving ? '⏳' : unsavedChanges ? '💾' : '✓'}
              </span>
            </Button>
            <Button
              onClick={handleReset}
              disabled={isSaving || isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold hidden md:block disabled:opacity-50"
            >
              {isSaving ? '⏳' : '🔄'} Reset
            </Button>
            <Button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              <span className="hidden sm:inline">Đăng Xuất</span>
              <span className="sm:hidden">✕</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 md:mb-8 overflow-hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {(['guide', 'hero', 'about', 'testimonials', 'gallery', 'contact', 'products', 'news', 'faqs', 'pages'] as TabType[]).map((tab) => {
              const tabLabels: Record<TabType, string> = {
                hero: '🏠 Hero',
                about: 'ℹ️ Giới thiệu',
                testimonials: '⭐ Đánh giá',
                gallery: '🖼️ Thư viện',
                contact: '📞 Liên hệ',
                products: '📦 Sản phẩm',
                news: '📰 Tin tức',
                faqs: '❓ FAQ',
                pages: '📄 Trang',
                guide: '📖 Hướng dẫn',
              }
              
              const isGuide = tab === 'guide'
              
              let buttonClasses = ''
              if (activeTab === tab) {
                buttonClasses = isGuide 
                  ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-2xl scale-110 ring-2 ring-blue-300 animate-pulse'
                  : 'bg-gradient-to-r from-[#2d5016] to-[#3d6826] text-white shadow-lg scale-105'
              } else {
                buttonClasses = isGuide
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 hover:scale-105 shadow-md border-2 border-blue-300'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
              }
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold whitespace-nowrap transition-all transform ${buttonClasses}`}
                >
                  <span className="hidden sm:inline">{tabLabels[tab]}</span>
                  <span className="sm:hidden">{tabLabels[tab].split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 lg:p-8 border border-gray-200">
          {activeTab === 'hero' && (
            <HeroEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'about' && (
            <AboutEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'contact' && (
            <ContactEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'products' && (
            <ProductsEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'news' && (
            <NewsEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'faqs' && (
            <FAQEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'pages' && (
            <PagesEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'guide' && <GuideEditor />}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105 flex-1 sm:flex-none disabled:opacity-50"
              >
                {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Tất Cả'}
              </Button>
              <Button
                onClick={handleReset}
                disabled={isSaving || isLoading}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all transform hover:scale-105 flex-1 sm:flex-none disabled:opacity-50"
              >
                🔄 Khôi Phục Mặc Định
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// About Editor Component
function AboutEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const about = content.pages.home.about

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2d5016] to-[#3d6826] rounded-lg flex items-center justify-center">
          <span className="text-2xl">ℹ️</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Phần Giới Thiệu</h2>
          <p className="text-sm text-gray-600">Trang chủ</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl border border-blue-200">
        <label htmlFor="about-title" className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề</label>
        <Input
          id="about-title"
          value={about.title}
          onChange={(e) =>
            setContent({
              ...content,
              pages: {
                ...content.pages,
                home: {
                  ...content.pages.home,
                  about: { ...about, title: e.target.value },
                },
              },
            })
          }
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:border-[#2d5016] focus:ring-2 focus:ring-[#2d5016] focus:ring-opacity-20"
        />
      </div>

      <div>
        <label htmlFor="about-emoji" className="block text-sm font-semibold text-gray-700 mb-2">Emoji</label>
        <Input
          id="about-emoji"
          value={about.emoji}
          onChange={(e) =>
            setContent({
              ...content,
              pages: {
                ...content.pages,
                home: {
                  ...content.pages.home,
                  about: { ...about, emoji: e.target.value },
                },
              },
            })
          }
          maxLength={2}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="about-quote" className="block text-sm font-semibold text-gray-700 mb-2">Câu Danh Ngôn</label>
        <Textarea
          id="about-quote"
          value={about.quoteText}
          onChange={(e) =>
            setContent({
              ...content,
              pages: {
                ...content.pages,
                home: {
                  ...content.pages.home,
                  about: { ...about, quoteText: e.target.value },
                },
              },
            })
          }
          rows={3}
          className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="about-logo" className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
        <ImageUploader
          value={about.logoImage}
          onChange={(url) =>
            setContent({
              ...content,
              pages: {
                ...content.pages,
                home: {
                  ...content.pages.home,
                  about: { ...about, logoImage: url },
                },
              },
            })
          }
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Nội dung ({about.content.length} đoạn)</h3>
        {about.content.map((text, idx) => (
          <div key={`${about.title}-content-${idx}`} className="space-y-2">
            <label htmlFor={`content-${idx}`} className="block text-sm font-semibold text-gray-700">Đoạn {idx + 1}</label>
            <Textarea
              id={`content-${idx}`}
              value={text}
              onChange={(e) => {
                const newContent = [...about.content]
                newContent[idx] = e.target.value
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    home: {
                      ...content.pages.home,
                      about: { ...about, content: newContent },
                    },
                  },
                })
              }}
              rows={4}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Testimonials Editor Component
function TestimonialsEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const [formData, setFormData] = useState({ name: '', role: '', image: '', rating: 5, feedback: '' })
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const testimonials = content.pages.home.testimonials
  const { toast } = useToast()

  const handleAddTestimonial = () => {
    if (!formData.name || !formData.feedback) {
      toast({
        title: '⚠️ Thiếu thông tin',
        description: 'Vui lòng nhập tên và nội dung đánh giá',
        variant: 'destructive',
      })
      return
    }
    const newTestimonial = {
      id: Math.max(...testimonials.map((t) => t.id), 0) + 1,
      name: formData.name,
      role: formData.role,
      image: formData.image,
      rating: formData.rating,
      feedback: formData.feedback,
    }
    setContent({
      ...content,
      pages: {
        ...content.pages,
        home: {
          ...content.pages.home,
          testimonials: [...testimonials, newTestimonial],
        },
      },
    })
    setFormData({ name: '', role: '', image: '', rating: 5, feedback: '' })
    toast({
      title: '✅ Đã thêm đánh giá',
      description: `Đánh giá của ${formData.name} đã được thêm`,
    })
  }

  const handleUpdateTestimonial = (id: number, field: keyof typeof formData, value: any) => {
    setContent({
      ...content,
      pages: {
        ...content.pages,
        home: {
          ...content.pages.home,
          testimonials: testimonials.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
        },
      },
    })
  }

  const handleDeleteTestimonial = (id: number) => {
    setContent({
      ...content,
      pages: {
        ...content.pages,
        home: {
          ...content.pages.home,
          testimonials: testimonials.filter((t) => t.id !== id),
        },
      },
    })
    if (expandedId === id) setExpandedId(null)
    toast({
      title: '🗑️ Đã xoá',
      description: 'Đánh giá đã được xoá',
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Trang Chủ - Đánh Giá & Nhận Xét</h2>

      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thêm Đánh Giá Mới</h3>
        <div className="space-y-4">
          <Input
            placeholder="Tên"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
          <Input
            placeholder="Chức vị"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
          <div>
            <p className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</p>
            <ImageUploader
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>
          <select
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number.parseInt(e.target.value) })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {'⭐'.repeat(r)} ({r})
              </option>
            ))}
          </select>
          <Textarea
            placeholder="Nội dung đánh giá"
            value={formData.feedback}
            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            rows={4}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
          <Button
            onClick={handleAddTestimonial}
            className="w-full bg-[#2d5016] hover:bg-[#3d6826] text-white font-bold py-2 rounded-lg"
          >
            Thêm Đánh Giá
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>📋</span> Danh Sách Đánh Giá{' '}
          <span className="bg-[#2d5016] text-white text-sm px-3 py-1 rounded-full">{testimonials.length}</span>
        </h3>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gradient-to-r from-white to-gray-50 p-4 md:p-6 rounded-xl border-l-4 border-yellow-400 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-sm text-yellow-500">{'⭐'.repeat(testimonial.rating)}</p>
                <p className="text-sm text-gray-700 mt-2">{testimonial.feedback}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setExpandedId(expandedId === testimonial.id ? null : testimonial.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition-all"
                >
                  {expandedId === testimonial.id ? '▲ Thu gọn' : '✏️ Chỉnh sửa'}
                </Button>
                <Button
                  onClick={() => handleDeleteTestimonial(testimonial.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-all"
                >
                  🗑️
                </Button>
              </div>
            </div>

            {expandedId === testimonial.id && (
              <div className="mt-5 space-y-4 pt-4 border-t-2 border-yellow-200">
                <div>
                  <label htmlFor={`testimonial-name-${testimonial.id}`} className="block text-sm font-semibold text-gray-700 mb-2">👤 Tên</label>
                  <Input
                    id={`testimonial-name-${testimonial.id}`}
                    value={testimonial.name}
                    onChange={(e) => handleUpdateTestimonial(testimonial.id, 'name', e.target.value)}
                    className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor={`testimonial-role-${testimonial.id}`} className="block text-sm font-semibold text-gray-700 mb-2">💼 Chức vị</label>
                  <Input
                    id={`testimonial-role-${testimonial.id}`}
                    value={testimonial.role}
                    onChange={(e) => handleUpdateTestimonial(testimonial.id, 'role', e.target.value)}
                    className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor={`testimonial-rating-${testimonial.id}`} className="block text-sm font-semibold text-gray-700 mb-2">⭐ Đánh giá</label>
                  <select
                    id={`testimonial-rating-${testimonial.id}`}
                    value={testimonial.rating}
                    onChange={(e) => handleUpdateTestimonial(testimonial.id, 'rating', Number.parseInt(e.target.value))}
                    className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {'⭐'.repeat(r)} ({r})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`testimonial-image-${testimonial.id}`} className="block text-sm font-semibold text-gray-700 mb-2">🖼️ Hình ảnh</label>
                  <ImageUploader
                    value={testimonial.image}
                    onChange={(url) => handleUpdateTestimonial(testimonial.id, 'image', url)}
                  />
                </div>
                <div>
                  <label htmlFor={`testimonial-feedback-${testimonial.id}`} className="block text-sm font-semibold text-gray-700 mb-2">💬 Nội dung đánh giá</label>
                  <Textarea
                    id={`testimonial-feedback-${testimonial.id}`}
                    value={testimonial.feedback}
                    onChange={(e) => handleUpdateTestimonial(testimonial.id, 'feedback', e.target.value)}
                    rows={4}
                    className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all"
                  />
                </div>
                <Button
                  onClick={() => {
                    setExpandedId(null)
                    toast({
                      title: '✅ Đã cập nhật',
                      description: 'Thay đổi đã được lưu',
                    })
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all"
                >
                  💾 Lưu thay đổi
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Gallery Editor Component
function GalleryEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const [formData, setFormData] = useState({ image: '', title: '', description: '', fullDescription: '' })
  const gallery = content.pages.home.gallery
  const { toast } = useToast()

  const handleAddImage = () => {
    if (!formData.image) {
      toast({
        title: '⚠️ Thiếu hình ảnh',
        description: 'Vui lòng chọn hoặc nhập URL hình ảnh',
        variant: 'destructive',
      })
      return
    }
    const newImage = {
      id: Date.now().toString(),
      image: formData.image,
      title: formData.title,
      description: formData.description,
      fullDescription: formData.fullDescription,
    }
    setContent({
      ...content,
      pages: {
        ...content.pages,
        home: {
          ...content.pages.home,
          gallery: [...gallery, newImage],
        },
      },
    })
    setFormData({ image: '', title: '', description: '', fullDescription: '' })
    toast({
      title: '✅ Đã thêm slide',
      description: 'Slide mới đã được thêm vào thư viện',
    })
  }

  const handleDeleteImage = (id: string) => {
    setContent({
      ...content,
      pages: {
        ...content.pages,
        home: {
          ...content.pages.home,
          gallery: gallery.filter((img) => img.id !== id),
        },
      },
    })
    toast({
      title: '🗑️ Đã xoá',
      description: 'Slide đã được xoá khỏi thư viện',
    })
  }

  const updateGalleryItem = (id: string, patch: Partial<typeof gallery[0]>) => {
    setContent({
      ...content,
      pages: {
        ...content.pages,
        home: {
          ...content.pages.home,
          gallery: gallery.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🖼️</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Thư Viện Ảnh</h2>
          <p className="text-sm text-gray-600">Trang chủ</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 rounded-xl border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>➕</span> Thêm Slide Mới
        </h3>
        <div className="space-y-4">
          <div>
            <p className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</p>
            <ImageUploader
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>
          <Input
            placeholder="Tiêu đề"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
          <Input
            placeholder="Mô tả ngắn"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
          <Textarea
            placeholder="Mô tả chi tiết"
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            rows={3}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
          />
          <Button
            onClick={handleAddImage}
            className="w-full bg-[#2d5016] hover:bg-[#3d6826] text-white font-bold py-2 rounded-lg"
          >
            Thêm Slide
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 transition-all shadow-sm hover:shadow-md">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img src={item.image} alt={item.title} className="w-full sm:w-32 h-32 object-cover rounded-lg" />
              <div className="flex-1 space-y-2">
                <Input value={item.title ?? ''} onChange={(e) => updateGalleryItem(item.id, { title: e.target.value })} placeholder="Tiêu đề" />
                <ImageUploader value={item.image ?? ''} onChange={(url) => updateGalleryItem(item.id, { image: url })} />
                <Input value={item.description ?? ''} onChange={(e) => updateGalleryItem(item.id, { description: e.target.value })} placeholder="Mô tả ngắn" />
                <Textarea value={item.fullDescription ?? ''} onChange={(e) => updateGalleryItem(item.id, { fullDescription: e.target.value })} rows={2} placeholder="Mô tả chi tiết" />
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleDeleteImage(item.id)} className="bg-red-500 text-white">Xoá</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Hero Editor Component
function HeroEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const hero = content.pages.home.hero

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <span className="text-2xl">🏠</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Hero Section</h2>
          <p className="text-sm text-gray-600">Trang chủ - Phần đầu tiên người dùng nhìn thấy</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 rounded-xl border border-blue-200 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề chính</label>
          <Input
            id="title"
            value={hero.title}
            onChange={(e) =>
              setContent({
                ...content,
                pages: {
                  ...content.pages,
                  home: {
                    ...content.pages.home,
                    hero: { ...hero, title: e.target.value },
                  },
                },
              })
            }
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
          <Textarea
            id="subtitle"
            value={hero.subtitle}
            onChange={(e) =>
              setContent({
                ...content,
                pages: {
                  ...content.pages,
                  home: {
                    ...content.pages.home,
                    hero: { ...hero, subtitle: e.target.value },
                  },
                },
              })
            }
            rows={3}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
          <ImageUploader
            value={hero.image}
            onChange={(url) =>
              setContent({
                ...content,
                pages: {
                  ...content.pages,
                  home: {
                    ...content.pages.home,
                    hero: { ...hero, image: url },
                  },
                },
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

// Contact Editor Component
function ContactEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const contact = content.pages.home.contactInfo

  return (
    <div className="space-y-6">
      {/* Modern Header with Icon Badge */}
      <div className="flex items-center gap-4 pb-4 border-b-2 border-cyan-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📞</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Thông Tin Liên Hệ</h2>
          <p className="text-sm text-gray-500">Trang chủ</p>
        </div>
      </div>

      {/* Form Section with Gradient */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 space-y-5 border-l-4 border-cyan-400 shadow-sm">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Điện thoại
          </label>
          <Input
            id="phone"
            value={contact.phone}
            onChange={(e) =>
              setContent({
                ...content,
                pages: {
                  ...content.pages,
                  home: {
                    ...content.pages.home,
                    contactInfo: { ...contact, phone: e.target.value },
                  },
                },
              })
            }
            className="w-full border-2 border-cyan-200 rounded-lg px-4 py-3 text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
            placeholder="+84 123 456 789"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={contact.email}
            onChange={(e) =>
              setContent({
                ...content,
                pages: {
                  ...content.pages,
                  home: {
                    ...content.pages.home,
                    contactInfo: { ...contact, email: e.target.value },
                  },
                },
              })
            }
            className="w-full border-2 border-cyan-200 rounded-lg px-4 py-3 text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
            Địa chỉ
          </label>
          <Input
            id="address"
            value={contact.address}
            onChange={(e) =>
              setContent({
                ...content,
                pages: {
                  ...content.pages,
                  home: {
                    ...content.pages.home,
                    contactInfo: { ...contact, address: e.target.value },
                  },
                },
              })
            }
            className="w-full border-2 border-cyan-200 rounded-lg px-4 py-3 text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
            placeholder="123 Đường ABC, Quận XYZ"
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
            Quốc gia
          </label>
          <Input
            id="country"
            value={contact.country}
            onChange={(e) =>
              setContent({
                ...content,
                pages: {
                  ...content.pages,
                  home: {
                    ...content.pages.home,
                    contactInfo: { ...contact, country: e.target.value },
                  },
                },
              })
            }
            className="w-full border-2 border-cyan-200 rounded-lg px-4 py-3 text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
            placeholder="Việt Nam"
          />
        </div>
      </div>
    </div>
  )
}

// Products Editor Component
function ProductsEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const [formData, setFormData] = useState({ name: '', title: '', tagline: '', description: '', image: '' })
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { toast } = useToast()

  const updateProduct = (updated: Partial<typeof content.products[0]> & { id: string }) => {
    setContent({
      ...content,
      products: content.products.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
    })
  }

  const handleAddProduct = () => {
    if (!formData.name) {
      toast({
        title: '⚠️ Thiếu tên sản phẩm',
        description: 'Vui lòng nhập tên sản phẩm',
        variant: 'destructive',
      })
      return
    }
    const newProduct = {
      id: Date.now().toString(),
      name: formData.name,
      title: formData.title,
      tagline: formData.tagline,
      benefits: [],
      description: formData.description,
      image: formData.image,
      specifications: [],
      faqs: [],
    }
    setContent({
      ...content,
      products: [...content.products, newProduct],
    })
    setFormData({ name: '', title: '', tagline: '', description: '', image: '' })
    toast({
      title: '✅ Đã thêm sản phẩm',
      description: `Sản phẩm "${formData.name}" đã được thêm`,
    })
  }

  const handleDeleteProduct = (id: string) => {
    setContent({
      ...content,
      products: content.products.filter((p) => p.id !== id),
    })
    if (expandedId === id) setExpandedId(null)
    toast({
      title: '🗑️ Đã xoá',
      description: 'Sản phẩm đã được xoá',
    })
  }

  const addBenefit = (productId: string) => {
    const p = content.products.find((x) => x.id === productId)
    if (!p) return
    const newBenefits = [...(p.benefits || []), { id: Date.now().toString(), text: 'Lợi ích mới' }]
    updateProduct({ id: productId, benefits: newBenefits })
  }

  const updateBenefit = (productId: string, benefitId: string, text: string) => {
    const p = content.products.find((x) => x.id === productId)
    if (!p) return
    const newBenefits = (p.benefits || []).map((b) => (b.id === benefitId ? { ...b, text } : b))
    updateProduct({ id: productId, benefits: newBenefits })
  }

  const removeBenefit = (productId: string, benefitId: string) => {
    const p = content.products.find((x) => x.id === productId)
    if (!p) return
    const newBenefits = (p.benefits || []).filter((b) => b.id !== benefitId)
    updateProduct({ id: productId, benefits: newBenefits })
  }

  // specifications removed to match product detail page fields

  const addProductFAQ = (productId: string) => {
    const p = content.products.find((x) => x.id === productId)
    if (!p) return
    const newFAQ = { id: Date.now(), question: 'Câu hỏi mới', answer: '', author: null, title: null }
    updateProduct({ id: productId, faqs: [...(p.faqs || []), newFAQ] })
  }

  const updateProductFAQ = (productId: string, faqId: number, field: 'question' | 'answer' | 'author' | 'title', value: any) => {
    const p = content.products.find((x) => x.id === productId)
    if (!p) return
    const newFAQs = (p.faqs || []).map((f) => (f.id === faqId ? { ...f, [field]: value } : f))
    updateProduct({ id: productId, faqs: newFAQs })
  }

  const removeProductFAQ = (productId: string, faqId: number) => {
    const p = content.products.find((x) => x.id === productId)
    if (!p) return
    const newFAQs = (p.faqs || []).filter((f) => f.id !== faqId)
    updateProduct({ id: productId, faqs: newFAQs })
  }

  return (
    <div className="space-y-6">
      {/* Modern Header with Icon Badge */}
      <div className="flex items-center gap-4 pb-4 border-b-2 border-emerald-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📦</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Sản Phẩm</h2>
          <p className="text-sm text-gray-500">
            Tổng cộng:{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {content.products.length} sản phẩm
            </span>
          </p>
        </div>
      </div>

      {/* Add Product Form with Gradient */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border-l-4 border-emerald-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">➕</span>{' '}
          Thêm Sản Phẩm Mới
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="prod-name" className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm</label>
            <Input
              id="prod-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Tên sản phẩm"
              className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prod-title" className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề</label>
              <Input
                id="prod-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Tiêu đề"
                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>
            <div>
              <label htmlFor="prod-tagline" className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
              <Input
                id="prod-tagline"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Tagline"
                className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="prod-desc" className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
            <Textarea
              id="prod-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả"
              rows={3}
              className="w-full border-2 border-emerald-200 rounded-lg px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="prod-image" className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
            <ImageUploader
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>
          <Button
            onClick={handleAddProduct}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ➕ Thêm Sản Phẩm
          </Button>
        </div>
      </div>

      {/* Products List & Editor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>📋</span>{' '}
          Danh Sách Sản Phẩm
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
        {content.products.map((product) => (
          <div key={product.id} className="bg-white p-5 rounded-xl border-l-4 border-emerald-400 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-lg">{product.name}</p>
                <p className="text-sm text-gray-600 mt-1">{product.title}</p>
                {product.image && (
                  <img src={product.image} alt={product.name} className="mt-3 w-full h-32 object-cover rounded-lg" />
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setExpandedId(expandedId === product.id ? null : product.id)} 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-all"
              >
                {expandedId === product.id ? '▲ Thu gọn' : '✏️ Chỉnh sửa'}
              </Button>
              <Button 
                onClick={() => handleDeleteProduct(product.id)} 
                className="bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                🗑️
              </Button>
            </div>

            {expandedId === product.id && (
              <div className="mt-5 space-y-4 pt-4 border-t-2 border-emerald-100">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`prod-name-${product.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Tên</label>
                    <Input 
                      id={`prod-name-${product.id}`} 
                      value={product.name} 
                      onChange={(e) => updateProduct({ id: product.id, name: e.target.value })} 
                      className="border-2 border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor={`prod-title-${product.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề</label>
                    <Input 
                      id={`prod-title-${product.id}`} 
                      value={product.title} 
                      onChange={(e) => updateProduct({ id: product.id, title: e.target.value })} 
                      className="border-2 border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`prod-tagline-${product.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                  <Input 
                    id={`prod-tagline-${product.id}`} 
                    value={product.tagline} 
                    onChange={(e) => updateProduct({ id: product.id, tagline: e.target.value })} 
                    className="border-2 border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor={`prod-desc-${product.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Mô tả</label>
                  <Textarea 
                    id={`prod-desc-${product.id}`} 
                    value={product.description} 
                    onChange={(e) => updateProduct({ id: product.id, description: e.target.value })} 
                    rows={4} 
                    className="border-2 border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor={`prod-image-${product.id}`} className="block text-sm font-semibold text-gray-700 mb-2">Hình ảnh</label>
                  <ImageUploader
                    value={product.image}
                    onChange={(url) => updateProduct({ id: product.id, image: url })}
                  />
                </div>

                {/* Benefits */}
                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span>✨</span>{' '}
                      Lợi ích
                    </h4>
                    <Button 
                      onClick={() => addBenefit(product.id)} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                    >
                      ➕ Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(product.benefits || []).map((b) => (
                      <div key={b.id} className="flex gap-2">
                        <Input 
                          value={b.text} 
                          onChange={(e) => updateBenefit(product.id, b.id, e.target.value)} 
                          className="border-2 border-emerald-200 focus:border-emerald-500"
                        />
                        <Button 
                          onClick={() => removeBenefit(product.id, b.id)} 
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications removed to match public product detail page */}

                {/* Product FAQs */}
                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <span>❓</span>{' '}
                      FAQ sản phẩm
                    </h4>
                    <Button 
                      onClick={() => addProductFAQ(product.id)} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                    >
                      ➕ Thêm
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {(product.faqs || []).map((f) => (
                      <div key={f.id} className="space-y-2 bg-white p-3 rounded-lg border-2 border-emerald-100 shadow-sm">
                        <Input 
                          value={f.question} 
                          placeholder="Câu hỏi" 
                          onChange={(e) => updateProductFAQ(product.id, f.id, 'question', e.target.value)} 
                          className="border-2 border-emerald-200 focus:border-emerald-500 font-semibold"
                        />
                        <Textarea 
                          value={f.answer} 
                          placeholder="Trả lời" 
                          rows={2} 
                          onChange={(e) => updateProductFAQ(product.id, f.id, 'answer', e.target.value)} 
                          className="border-2 border-emerald-200 focus:border-emerald-500"
                        />
                        <div className="flex gap-2">
                          <Input 
                            value={f.author || ''} 
                            placeholder="Tác giả" 
                            onChange={(e) => updateProductFAQ(product.id, f.id, 'author', e.target.value)} 
                            className="border-2 border-emerald-200 focus:border-emerald-500"
                          />
                          <Input 
                            value={f.title || ''} 
                            placeholder="Chức vụ" 
                            onChange={(e) => updateProductFAQ(product.id, f.id, 'title', e.target.value)} 
                            className="border-2 border-emerald-200 focus:border-emerald-500"
                          />
                          <Button 
                            onClick={() => removeProductFAQ(product.id, f.id)} 
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

// News Editor Component
function NewsEditor({
  content,
  setContent,
  onSave,
  isSaving,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
  onSave?: () => void | Promise<void>
  isSaving?: boolean
}>) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    category: '',
    featured: false,
    content: '',
    layout: 'standard' as 'standard' | 'large-image' | 'split',
    author: '',
  })

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const { toast } = useToast()

  const handleAddNews = () => {
    if (!formData.title) {
      toast({
        title: '⚠️ Thiếu tiêu đề',
        description: 'Vui lòng nhập tiêu đề bài viết',
        variant: 'destructive',
      })
      return
    }
    const newArticle = {
      id: Date.now(),
      title: formData.title,
      excerpt: formData.excerpt,
      date: formData.date,
      image: formData.image,
      category: formData.category,
      featured: formData.featured,
      content: formData.content,
      layout: formData.layout,
      author: formData.author || null,
    }
    setContent({
      ...content,
      news: [...content.news, newArticle],
    })
    setFormData({
      title: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      category: '',
      featured: false,
      content: '',
      layout: 'standard',
      author: '',
    })
    setExpandedId(newArticle.id)
    toast({
      title: '✅ Đã thêm tin tức',
      description: `Bài viết "${formData.title}" đã được thêm`,
    })
  }

  const handleDeleteNews = (id: number) => {
    setContent({
      ...content,
      news: content.news.filter((n) => n.id !== id),
    })
    if (expandedId === id) setExpandedId(null)
    toast({
      title: '🗑️ Đã xoá',
      description: 'Bài viết đã được xoá',
    })
  }

  const updateArticle = (id: number, patch: Partial<typeof content.news[0]>) => {
    setContent({
      ...content,
      news: content.news.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })
  }

  const handlePreview = async (articleId?: number) => {
    try {
      // Persist current content so preview page reads latest
      await saveAdminContentToServer(content)
      const idToOpen = articleId ?? (content.news.length ? content.news.at(-1)?.id : null)
      if (idToOpen) {
        window.open(`/tin-tuc/${idToOpen}`, '_blank')
      } else {
        toast({
          title: '⚠️ Không có bài viết',
          description: 'Vui lòng thêm bài viết trước',
          variant: 'destructive',
        })
      }
    } catch (e) {
      console.error('Preview error', e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Modern Header with Icon Badge */}
      <div className="flex items-center gap-4 pb-4 border-b-2 border-indigo-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📰</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Tin Tức</h2>
          <p className="text-sm text-gray-500">
            Tổng cộng:{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {content.news.length} bài viết
            </span>
          </p>
        </div>
      </div>

      {/* Add News Form with Gradient */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-l-4 border-indigo-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">➕</span>{' '}
          Thêm Tin Tức Mới
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="news-title" className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề</label>
            <Input
              id="news-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Tiêu đề bài viết"
              className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="news-excerpt" className="block text-sm font-semibold text-gray-700 mb-2">Tóm tắt</label>
            <Textarea
              id="news-excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Tóm tắt bài viết"
              rows={3}
              className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="news-date" className="block text-sm font-semibold text-gray-700 mb-2">📅 Ngày</label>
              <Input
                id="news-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>
            <div>
              <label htmlFor="news-category" className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Danh mục</label>
              <Input
                id="news-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Danh mục"
                className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>
          </div>
          <div>
            <label htmlFor="news-image" className="block text-sm font-semibold text-gray-700 mb-2">🖼️ Hình ảnh</label>
            <ImageUploader
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>

          <div>
            <label htmlFor="news-author" className="block text-sm font-semibold text-gray-700 mb-2">✍️ Tác giả</label>
            <Input
              id="news-author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Tên tác giả"
              className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          <div>
            <label htmlFor="news-layout" className="block text-sm font-semibold text-gray-700 mb-2">📐 Bố cục</label>
            <select 
              id="news-layout" 
              value={formData.layout} 
              onChange={(e) => setFormData({ ...formData, layout: e.target.value as any })} 
              className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            >
              <option value="standard">Chuẩn</option>
              <option value="large-image">Ảnh lớn</option>
              <option value="split">Hai cột</option>
            </select>
          </div>

          <div>
            <label htmlFor="news-content" className="block text-sm font-semibold text-gray-700 mb-2">📝 Nội dung (HTML)</label>
            <Textarea
              id="news-content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Nội dung bài viết (có thể dùng HTML)"
              rows={8}
              className="w-full border-2 border-indigo-200 rounded-lg px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-mono text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddNews}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              ➕ Thêm Tin Tức
            </Button>
            <Button 
              onClick={() => handlePreview()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              👁️ Xem trước
            </Button>
          </div>
        </div>
      </div>

      {/* News List with Modern Card Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>📋</span>{' '}
          Danh Sách Tin Tức
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
        {content.news.map((article) => (
          <div key={article.id} className="bg-white p-5 rounded-xl border-l-4 border-indigo-400 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <p className="font-semibold text-gray-800 text-lg">{article.title}</p>
                  {article.featured && (
                    <span className="inline-flex items-center bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      ⭐ Nổi bật
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span>📅 {article.date}</span>
                  {article.category && (
                    <>
                      <span>•</span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                        {article.category}
                      </span>
                    </>
                  )}
                </p>
                {article.image && (
                  <img src={article.image} alt={article.title} className="mt-3 w-full h-32 object-cover rounded-lg" />
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => { setExpandedId(expandedId === article.id ? null : article.id) }} 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white transition-all"
              >
                {expandedId === article.id ? '▲ Thu gọn' : '✏️ Chỉnh sửa'}
              </Button>
              <Button 
                onClick={() => handlePreview(article.id)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
              >
                👁️
              </Button>
              <Button 
                onClick={() => handleDeleteNews(article.id)} 
                className="bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                🗑️
              </Button>
            </div>

            {expandedId === article.id && (
              <div className="mt-5 space-y-3 pt-4 border-t-2 border-indigo-100">
                <Input 
                  value={article.title} 
                  onChange={(e) => updateArticle(article.id, { title: e.target.value })} 
                  placeholder="Tiêu đề" 
                  className="border-2 border-indigo-200 focus:border-indigo-500"
                />
                <Input 
                  value={article.excerpt} 
                  onChange={(e) => updateArticle(article.id, { excerpt: e.target.value })} 
                  placeholder="Tóm tắt" 
                  className="border-2 border-indigo-200 focus:border-indigo-500"
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input 
                    type="date" 
                    value={article.date} 
                    onChange={(e) => updateArticle(article.id, { date: e.target.value })} 
                    className="border-2 border-indigo-200 focus:border-indigo-500"
                  />
                  <Input 
                    value={article.category} 
                    onChange={(e) => updateArticle(article.id, { category: e.target.value })} 
                    placeholder="Danh mục" 
                    className="border-2 border-indigo-200 focus:border-indigo-500"
                  />
                </div>
                <Input 
                  value={(article as any).author || ''} 
                  placeholder="Tác giả" 
                  onChange={(e) => updateArticle(article.id, { author: e.target.value })} 
                  className="border-2 border-indigo-200 focus:border-indigo-500"
                />
                <ImageUploader 
                  value={article.image ?? ''} 
                  onChange={(url) => updateArticle(article.id, { image: url })} 
                />
                <select 
                  value={(article.layout as any) ?? 'standard'} 
                  onChange={(e) => updateArticle(article.id, { layout: e.target.value as any })} 
                  className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="standard">Chuẩn</option>
                  <option value="large-image">Ảnh lớn</option>
                  <option value="split">Hai cột</option>
                </select>
                <Textarea 
                  value={article.content ?? ''} 
                  onChange={(e) => updateArticle(article.id, { content: e.target.value })} 
                  rows={6} 
                  placeholder="Nội dung HTML" 
                  className="border-2 border-indigo-200 focus:border-indigo-500 font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={onSave} 
                    disabled={isSaving}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                  >
                    {isSaving ? '⏳ Đang lưu...' : '💾 Lưu'}
                  </Button>
                  <Button 
                    onClick={() => handlePreview(article.id)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    👁️ Xem trước
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

// FAQ Editor Component
function FAQEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const [selectedProduct, setSelectedProduct] = useState('1')
  const [formData, setFormData] = useState({ question: '', answer: '', author: '', title: '' })
  const { toast } = useToast()

  const handleAddFAQ = () => {
    if (!formData.question || !formData.answer) {
      toast({
        title: '⚠️ Thiếu thông tin',
        description: 'Vui lòng nhập câu hỏi và câu trả lời',
        variant: 'destructive',
      })
      return
    }
    const faqs = content.faqs[selectedProduct] || []
    const newFAQ = {
      id: Date.now(),
      question: formData.question,
      answer: formData.answer,
      author: formData.author || null,
      title: formData.title || null,
    }
    setContent({
      ...content,
      faqs: {
        ...content.faqs,
        [selectedProduct]: [...faqs, newFAQ],
      },
    })
    setFormData({ question: '', answer: '', author: '', title: '' })
    toast({
      title: '✅ Đã thêm FAQ',
      description: 'Câu hỏi thường gặp đã được thêm',
    })
  }

  const handleDeleteFAQ = (productId: string, faqId: number) => {
    setContent({
      ...content,
      faqs: {
        ...content.faqs,
        [productId]: content.faqs[productId]?.filter((f) => f.id !== faqId) || [],
      },
    })
    toast({
      title: '🗑️ Đã xoá',
      description: 'FAQ đã được xoá',
    })
  }

  const currentFAQs = content.faqs[selectedProduct] || []

  return (
    <div className="space-y-6">
      {/* Modern Header with Icon Badge */}
      <div className="flex items-center gap-4 pb-4 border-b-2 border-amber-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">❓</span>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Câu Hỏi Thường Gặp</h2>
          <p className="text-sm text-gray-500">
            Sản phẩm {selectedProduct}:{' '}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              {currentFAQs.length} câu hỏi
            </span>
          </p>
        </div>
      </div>

      {/* Product Selection */}
      <div className="bg-white p-4 rounded-xl border-2 border-amber-200 shadow-sm">
        <label htmlFor="faq-product" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>📦</span>{' '}
          Chọn Sản Phẩm
        </label>
        <select
          id="faq-product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
        >
          <option value="1">Sản phẩm 1</option>
          <option value="2">Sản phẩm 2</option>
          <option value="3">Sản phẩm 3</option>
        </select>
      </div>

      {/* Add FAQ Form with Gradient */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-amber-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">➕</span>{' '}
          Thêm Câu Hỏi Mới
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="faq-question" className="block text-sm font-semibold text-gray-700 mb-2">
              ❔ Câu hỏi
            </label>
            <Input
              id="faq-question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Câu hỏi"
              className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="faq-answer" className="block text-sm font-semibold text-gray-700 mb-2">
              💬 Câu trả lời
            </label>
            <Textarea
              id="faq-answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Câu trả lời"
              rows={4}
              className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="faq-author" className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Tác giả (tuỳ chọn)
              </label>
              <Input
                id="faq-author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Tên tác giả"
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>
            <div>
              <label htmlFor="faq-title" className="block text-sm font-semibold text-gray-700 mb-2">
                💼 Chức vị (tuỳ chọn)
              </label>
              <Input
                id="faq-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Chức vị"
                className="w-full border-2 border-amber-200 rounded-lg px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
              />
            </div>
          </div>
          <Button
            onClick={handleAddFAQ}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            ➕ Thêm Câu Hỏi
          </Button>
        </div>
      </div>

      {/* FAQs List with Modern Card Design */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>📋</span>{' '}
          Danh Sách Câu Hỏi
        </h3>
        <div className="space-y-3">
        {currentFAQs.map((faq) => (
          <div key={faq.id} className="bg-white p-5 rounded-xl border-l-4 border-amber-400 shadow-md hover:shadow-lg transition-all">
            <div className="flex justify-between items-start gap-4 mb-3">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-base mb-2 flex items-start gap-2">
                  <span className="text-amber-600 flex-shrink-0">❔</span>
                  <span>{faq.question}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2 pl-6">{faq.answer}</p>
                {faq.author && (
                  <p className="text-xs text-gray-500 pl-6 flex items-center gap-1">
                    <span>👤</span>
                    <span>{faq.author}</span>
                    {faq.title && <span className="text-gray-400">({faq.title})</span>}
                  </p>
                )}
              </div>
              <Button
                onClick={() => handleDeleteFAQ(selectedProduct, faq.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-sm rounded-lg transition-all flex-shrink-0"
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

// Pages Editor Component
function PagesEditor({
  content,
  setContent,
}: Readonly<{
  content: AdminContent
  setContent: (content: AdminContent) => void
}>) {
  const [selectedPage, setSelectedPage] = useState<'home' | 'about'>('home')
  const pageContent = content.pages[selectedPage]

  return (
    <div className="space-y-6">
      {/* Modern Header with Icon Badge */}
      <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📄</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Các Trang</h2>
          <p className="text-sm text-gray-500">Chỉnh sửa nội dung trang</p>
        </div>
      </div>

      {/* Page Selection with Modern Toggle */}
      <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border-2 border-slate-200">
        <button
          onClick={() => setSelectedPage('home')}
          className={`flex-1 px-5 py-3 rounded-lg font-semibold transition-all transform ${
            selectedPage === 'home'
              ? 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🏠 Trang Chủ
        </button>
        <button
          onClick={() => setSelectedPage('about')}
          className={`flex-1 px-5 py-3 rounded-lg font-semibold transition-all transform ${
            selectedPage === 'about'
              ? 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ℹ️ Về Chúng Tôi
        </button>
      </div>

      {/* Page Hero Editor with Gradient */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl border-l-4 border-slate-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">🎯</span>{' '}
          Hero Section
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="page-hero-title" className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Tiêu đề
            </label>
            <Input
              id="page-hero-title"
              value={pageContent.hero.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    [selectedPage]: {
                      ...pageContent,
                      hero: { ...pageContent.hero, title: e.target.value },
                    },
                  },
                })
              }
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="page-hero-subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
              📋 Mô tả
            </label>
            <Textarea
              id="page-hero-subtitle"
              value={pageContent.hero.subtitle}
              onChange={(e) =>
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    [selectedPage]: {
                      ...pageContent,
                      hero: { ...pageContent.hero, subtitle: e.target.value },
                    },
                  },
                })
              }
              rows={3}
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="page-hero-image" className="block text-sm font-semibold text-gray-700 mb-2">
              🖼️ Hình ảnh
            </label>
            <ImageUploader
              value={pageContent.hero.image}
              onChange={(url) =>
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    [selectedPage]: {
                      ...pageContent,
                      hero: { ...pageContent.hero, image: url },
                    },
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Page Contact Info with Gradient */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-xl border-l-4 border-slate-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📞</span>{' '}
          Thông Tin Liên Hệ
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="page-contact-phone" className="block text-sm font-semibold text-gray-700 mb-2">
              📱 Điện thoại
            </label>
            <Input
              id="page-contact-phone"
              value={pageContent.contactInfo.phone}
              onChange={(e) =>
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    [selectedPage]: {
                      ...pageContent,
                      contactInfo: { ...pageContent.contactInfo, phone: e.target.value },
                    },
                  },
                })
              }
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="page-contact-email" className="block text-sm font-semibold text-gray-700 mb-2">
              ✉️ Email
            </label>
            <Input
              id="page-contact-email"
              value={pageContent.contactInfo.email}
              onChange={(e) =>
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    [selectedPage]: {
                      ...pageContent,
                      contactInfo: { ...pageContent.contactInfo, email: e.target.value },
                    },
                  },
                })
              }
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="page-contact-address" className="block text-sm font-semibold text-gray-700 mb-2">
              📍 Địa chỉ
            </label>
            <Input
              id="page-contact-address"
              value={pageContent.contactInfo.address}
              onChange={(e) =>
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    [selectedPage]: {
                      ...pageContent,
                      contactInfo: { ...pageContent.contactInfo, address: e.target.value },
                    },
                  },
                })
              }
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
          <div>
            <label htmlFor="page-contact-country" className="block text-sm font-semibold text-gray-700 mb-2">
              🌍 Quốc gia
            </label>
            <Input
              id="page-contact-country"
              value={pageContent.contactInfo.country}
              onChange={(e) =>
                setContent({
                  ...content,
                  pages: {
                    ...content.pages,
                    [selectedPage]: {
                      ...pageContent,
                      contactInfo: { ...pageContent.contactInfo, country: e.target.value },
                    },
                  },
                })
              }
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Guide Editor Component
function GuideEditor() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b-2 border-blue-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📖</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hướng Dẫn Sử Dụng Admin Panel</h2>
          <p className="text-sm text-gray-500">Tài liệu hướng dẫn chi tiết</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>👋</span>{' '}
          Chào mừng
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Admin Panel cho phép bạn quản lý toàn bộ nội dung website CAMICO một cách dễ dàng. 
          Bạn có thể chỉnh sửa văn bản, hình ảnh, sản phẩm, tin tức và nhiều hơn nữa mà không cần kiến thức lập trình.
        </p>
      </div>

      {/* Main Features */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚙️</span>{' '}
          Các Chức Năng Chính
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span>🏠</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Hero Section</h4>
              <p className="text-sm text-gray-600">Chỉnh sửa banner chính của trang chủ, bao gồm tiêu đề, mô tả và hình ảnh nền.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span>ℹ️</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Giới Thiệu</h4>
              <p className="text-sm text-gray-600">Quản lý nội dung giới thiệu về công ty, sứ mệnh và thông điệp.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span>⭐</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Đánh Giá</h4>
              <p className="text-sm text-gray-600">Thêm, chỉnh sửa và xoá các đánh giá của khách hàng. Bạn có thể click "Chỉnh sửa" để sửa đổi đánh giá đã có.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span>🖼️</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Thư Viện</h4>
              <p className="text-sm text-gray-600">Quản lý các slide hình ảnh hiển thị trên trang chủ.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
              <span>📞</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Liên Hệ</h4>
              <p className="text-sm text-gray-600">Cập nhật thông tin liên hệ: số điện thoại, email, địa chỉ và quốc gia.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span>📦</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Sản Phẩm</h4>
              <p className="text-sm text-gray-600">Thêm mới, chỉnh sửa sản phẩm. Mỗi sản phẩm có thể có lợi ích và FAQ riêng.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span>📰</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Tin Tức</h4>
              <p className="text-sm text-gray-600">Tạo và quản lý bài viết tin tức. Hỗ trợ HTML và nhiều bố cục khác nhau. Có nút "Xem trước" để kiểm tra trước khi lưu.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <span>❓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">FAQ</h4>
              <p className="text-sm text-gray-600">Quản lý câu hỏi thường gặp theo từng sản phẩm.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <span>📄</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Trang</h4>
              <p className="text-sm text-gray-600">Chỉnh sửa nội dung của các trang khác nhau (Trang Chủ, Về Chúng Tôi).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Buttons */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔘</span>{' '}
          Các Nút Quan Trọng
        </h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💾</span>
              <h4 className="font-semibold text-gray-800">Nút Lưu (Save)</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              - Lưu tất cả thay đổi vào trình duyệt (localStorage)
            </p>
            <p className="text-sm text-gray-600 mb-2">
              - Nút sẽ sáng màu vàng và nhấp nháy khi có thay đổi chưa lưu
            </p>
            <p className="text-sm text-gray-600">
              - <strong>Lưu ý:</strong> Dữ liệu chỉ lưu trên trình duyệt hiện tại. Nếu xoá cache hoặc dùng trình duyệt khác sẽ không thấy thay đổi.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔄</span>
              <h4 className="font-semibold text-gray-800">Nút Reset / Khôi Phục</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              - Đặt lại toàn bộ nội dung về mặc định ban đầu
            </p>
            <p className="text-sm text-gray-600 mb-2">
              - Sẽ xoá tất cả các thay đổi bạn đã thực hiện
            </p>
            <p className="text-sm text-red-600 font-semibold">
              ⚠️ Cảnh báo: Hành động này không thể hoàn tác! Sẽ có hộp thoại xác nhận trước khi thực hiện.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">✏️</span>
              <h4 className="font-semibold text-gray-800">Nút Chỉnh Sửa</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              - Mở form chỉnh sửa cho mục đã có (trong Đánh giá, Sản phẩm, Tin tức, v.v.)
            </p>
            <p className="text-sm text-gray-600">
              - Click lại để thu gọn form
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🗑️</span>
              <h4 className="font-semibold text-gray-800">Nút Xoá</h4>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              - Xoá mục khỏi danh sách
            </p>
            <p className="text-sm text-yellow-600">
              ⚠️ Nhớ nhấn "Lưu" sau khi xoá để thay đổi được lưu lại.
            </p>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🖼️</span>{' '}
          Upload Hình Ảnh
        </h3>
        <div className="space-y-3">
          <p className="text-gray-700">
            <strong>Cách upload hình ảnh:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-2">
            <li>Click vào ô "Chọn hoặc kéo thả hình ảnh"</li>
            <li>Chọn file hình ảnh từ máy tính (JPG, PNG, GIF, WebP)</li>
            <li>Hình sẽ tự động upload lên Vercel Blob Storage</li>
            <li>URL hình ảnh sẽ được điền vào ô input</li>
            <li>Bạn cũng có thể paste trực tiếp URL hình ảnh từ nguồn khác</li>
          </ol>
          <div className="bg-white p-3 rounded-lg border border-purple-200 mt-3">
            <p className="text-sm text-gray-600">
              💡 <strong>Mẹo:</strong> Nên dùng hình ảnh có kích thước phù hợp để website load nhanh hơn. 
              Kích thước khuyến nghị: dưới 2MB, độ phân giải 1920x1080 hoặc nhỏ hơn.
            </p>
          </div>
        </div>
      </div>

      {/* Tips & Best Practices */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border-l-4 border-green-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>💡</span>{' '}
          Mẹo & Lưu Ý
        </h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Lưu thường xuyên:</strong> Nhấn nút "Lưu" sau mỗi lần chỉnh sửa quan trọng để tránh mất dữ liệu.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Kiểm tra trước khi lưu:</strong> Với tin tức, dùng nút "Xem trước" để kiểm tra bố cục trước khi lưu.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Responsive:</strong> Giao diện admin được tối ưu cho cả desktop, tablet và mobile.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-green-600 flex-shrink-0">✓</span>
            <p className="text-sm text-gray-700">
              <strong>Toast notifications:</strong> Mỗi hành động sẽ có thông báo xác nhận ở góc trên bên phải.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-yellow-600 flex-shrink-0">⚠️</span>
            <p className="text-sm text-gray-700">
              <strong>Dữ liệu local:</strong> Tất cả thay đổi chỉ lưu trên trình duyệt hiện tại. Không đồng bộ giữa các thiết bị.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="text-yellow-600 flex-shrink-0">⚠️</span>
            <p className="text-sm text-gray-700">
              <strong>Backup:</strong> Nếu cần backup, hãy sao chép localStorage hoặc export dữ liệu thủ công.
            </p>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border-l-4 border-red-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔒</span>{' '}
          Bảo Mật
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            <strong>Mật khẩu hiện tại:</strong> <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
          </p>
          <p className="text-sm text-gray-700">
            ⚠️ Để thay đổi mật khẩu, vui lòng liên hệ developer hoặc chỉnh sửa trong code tại file <code className="bg-gray-100 px-2 py-1 rounded">app/admin/page.tsx</code>
          </p>
          <p className="text-sm text-gray-700">
            Sau khi đăng nhập, phiên làm việc sẽ được duy trì cho đến khi bạn đăng xuất hoặc tắt tab trình duyệt.
          </p>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-l-4 border-blue-400 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📧</span>{' '}
          Hỗ Trợ
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Nếu bạn gặp vấn đề hoặc cần hỗ trợ thêm, vui lòng liên hệ:
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>📧 Email: support@camico.com</p>
          <p>📞 Hotline: 1900-xxxx</p>
          <p>⏰ Thời gian hỗ trợ: 8:00 - 17:00 (T2-T6)</p>
        </div>
      </div>
    </div>
  )
}
