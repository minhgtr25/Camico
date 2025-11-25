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

type TabType = 'hero' | 'contact' | 'products' | 'news' | 'faqs' | 'pages' | 'about' | 'testimonials' | 'gallery' | 'guide' | 'contactPage' | 'productsPage' | 'aboutPartners' | 'aboutMission' | 'aboutMessage'

export default function AdminPanel() {
  const [adminContent, setAdminContent] = useState<AdminContent>(defaultAdminContent)
  const [activeTab, setActiveTab] = useState<TabType>('guide')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
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
          duration: 1000,
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
        duration: 1000,
      })
    } else {
      toast({
        title: '❌ Mật khẩu không đúng',
        description: 'Vui lòng thử lại',
        variant: 'destructive',
        duration: 1000,
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
          duration: 1000,
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
        duration: 1000,
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
            duration: 1000,
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
          duration: 1000,
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

  // Navigation structure with categories
  const navigationGroups = [
    {
      title: '🚀 Bắt đầu',
      items: [
        { id: 'guide' as TabType, icon: '📖', label: 'Hướng dẫn', badge: 'Mới' }
      ]
    },
    {
      title: '🏠 Trang chủ',
      items: [
        { id: 'hero' as TabType, icon: '🎯', label: 'Hero Section' },
        { id: 'about' as TabType, icon: 'ℹ️', label: 'Giới thiệu' },
        { id: 'products' as TabType, icon: '📦', label: 'Sản phẩm' },
        { id: 'news' as TabType, icon: '📰', label: 'Tin tức' },
        { id: 'testimonials' as TabType, icon: '⭐', label: 'Đánh giá' },
        { id: 'gallery' as TabType, icon: '🖼️', label: 'Thư viện ảnh' },
        { id: 'contact' as TabType, icon: '📞', label: 'Liên hệ' },
        { id: 'faqs' as TabType, icon: '❓', label: 'Câu hỏi' },
      ]
    },
    {
      title: '📄 Trang riêng',
      items: [
        { id: 'contactPage' as TabType, icon: '📧', label: 'Trang Liên Hệ' },
        { id: 'productsPage' as TabType, icon: '🛍️', label: 'Trang Sản Phẩm' },
      ]
    },
    {
      title: '🏢 Về chúng tôi',
      items: [
        { id: 'aboutPartners' as TabType, icon: '🤝', label: 'Đối tác' },
        { id: 'aboutMission' as TabType, icon: '🎯', label: 'Sứ mệnh' },
        { id: 'aboutMessage' as TabType, icon: '💬', label: 'Thông điệp' },
      ]
    },
  ]

  // Filter navigation items based on search
  const filteredGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0)

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3 md:py-4 flex items-center justify-between gap-4">
          {/* Left Section - Logo & Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2d5016] to-[#3d6826] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">CAMICO Admin</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Content Management System</p>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className={`${
                unsavedChanges 
                  ? 'bg-[#2d5016] hover:bg-[#3d6826] shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } font-semibold px-4 py-2 transition-all disabled:opacity-50 border-0`}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  <span className="hidden sm:inline">Đang lưu...</span>
                </>
              ) : unsavedChanges ? (
                <>
                  <span className="mr-2">💾</span>
                  <span className="hidden sm:inline">Lưu thay đổi</span>
                </>
              ) : (
                <>
                  <span className="mr-2">✓</span>
                  <span className="hidden sm:inline">Đã lưu</span>
                </>
              )}
            </Button>

            {/* Reset Button */}
            <Button
              onClick={handleReset}
              disabled={isSaving || isLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 md:px-4 py-2 disabled:opacity-50 border-0"
            >
              <span className="mr-1 md:mr-2">🔄</span>
              <span className="hidden sm:inline">Reset</span>
            </Button>

            {/* Logout Button */}
            <Button
              onClick={() => setIsAuthenticated(false)}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 md:px-4 py-2 border-0"
            >
              <span className="hidden sm:inline mr-2">Đăng xuất</span>
              <span>✕</span>
            </Button>
          </div>
        </div>

        {/* Save Status Bar */}
        {unsavedChanges && (
          <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
            <p className="text-sm text-yellow-800 text-center">
              ⚠️ Bạn có thay đổi chưa lưu. Nhấn <strong>Lưu thay đổi</strong> để cập nhật.
            </p>
          </div>
        )}
      </header>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Sidebar Navigation */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[88px] left-0 h-full w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 shadow-lg transition-transform duration-300 z-30 flex flex-col`}>
          {/* Search */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="text"
                placeholder="Tìm kiếm trang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d5016] focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Groups */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
                  <span>{group.title.split(' ')[0]}</span>
                  <span className="text-gray-400">{group.title.split(' ').slice(1).join(' ')}</span>
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id)
                        if (window.innerWidth < 1024) setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all group ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-[#2d5016] to-[#3d6826] text-white shadow-md scale-[1.02]'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.01]'
                      }`}
                    >
                      <span className={`text-lg transition-transform ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      {activeTab === item.id && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-xs text-gray-600 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2d5016]">CAMICO Admin</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">v1.0</span>
              </div>
              <p className="text-[10px] text-gray-500">© 2024 All rights reserved</p>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
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

          {activeTab === 'contactPage' && (
            <ContactPageEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'aboutPartners' && (
            <AboutPartnersEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'aboutMission' && (
            <AboutMissionEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'aboutMessage' && (
            <AboutMessageEditor
              content={adminContent}
              setContent={(content) => {
                setAdminContent(content)
                setUnsavedChanges(true)
              }}
            />
          )}

          {activeTab === 'productsPage' && (
            <ProductsPageEditor
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
        </main>
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
  const about = content.pages?.home?.about || { title: '', emoji: '', content: [], quoteText: '', logoImage: '' }

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
        {(about.content || []).map((text, idx) => (
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
  const testimonials = content.pages?.home?.testimonials || []
  const { toast } = useToast()

  const handleAddTestimonial = () => {
    if (!formData.name || !formData.feedback) {
      toast({
        title: '⚠️ Thiếu thông tin',
        description: 'Vui lòng nhập tên và nội dung đánh giá',
        variant: 'destructive',
        duration: 1000,
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
      duration: 1000,
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
      duration: 1000,
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
                      duration: 1000,
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
  const gallery = content.pages?.home?.gallery || []
  const { toast } = useToast()

  const handleAddImage = () => {
    if (!formData.image) {
      toast({
        title: '⚠️ Thiếu hình ảnh',
        description: 'Vui lòng chọn hoặc nhập URL hình ảnh',
        variant: 'destructive',
        duration: 1000,
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
  const hero = content.pages?.home?.hero || { title: '', subtitle: '', image: '', buttonText: '', buttonLink: '' }

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
  const contact = content.pages?.home?.contactInfo || { phone: '', email: '', address: '' }

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
      products: (content.products || []).map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
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
        {(content.products || []).map((product) => (
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
      news: (content.news || []).map((n) => (n.id === id ? { ...n, ...patch } : n)),
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
            <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition-all">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <div>
                <div className="font-semibold text-gray-800">⭐ Bài nổi bật</div>
                <div className="text-xs text-gray-500">Bài viết này sẽ hiển thị ở vị trí nổi bật trên landing page và /tin-tuc</div>
              </div>
            </label>
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
        {(content.news || []).map((article) => (
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
                <div>
                  <label className="flex items-center gap-3 cursor-pointer bg-indigo-50 p-3 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-all">
                    <input
                      type="checkbox"
                      checked={article.featured || false}
                      onChange={(e) => updateArticle(article.id, { featured: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-semibold text-sm text-gray-800">⭐ Bài nổi bật</div>
                      <div className="text-xs text-gray-500">Hiển thị ở landing page và /tin-tuc</div>
                    </div>
                  </label>
                </div>
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
        {(currentFAQs || []).map((faq) => (
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

// Contact Page Editor Component
function ContactPageEditor({
  content,
  setContent,
}: {
  content: AdminContent
  setContent: (content: AdminContent) => void
}) {
  const contactPage = content.pages?.contact || {
    hero: { title: '', subtitle: '' },
    contactCards: [
      { icon: 'Phone', title: 'Điện thoại', description: '', value: '' },
      { icon: 'Mail', title: 'Email', description: '', value: '' },
      { icon: 'MapPin', title: 'Địa chỉ', description: '', value: '' },
    ],
    mapEmbedUrl: '',
  }

  const updateContactPage = (field: string, value: any) => {
    setContent({
      ...content,
      pages: {
        ...content.pages,
        contact: {
          ...contactPage,
          [field]: value,
        },
      },
    })
  }

  const updateContactCard = (index: number, field: string, value: string) => {
    const updatedCards = [...(contactPage.contactCards || [])]
    updatedCards[index] = { ...updatedCards[index], [field]: value }
    updateContactPage('contactCards', updatedCards)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📧</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trang Liên Hệ</h2>
          <p className="text-sm text-gray-500">Chỉnh sửa nội dung trang liên hệ</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>🎯</span> Hero Section
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
          <Input
            value={contactPage.hero.title}
            onChange={(e) => updateContactPage('hero', { ...contactPage.hero, title: e.target.value })}
            placeholder="Liên Hệ Với Chúng Tôi"
            className="border-2 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phụ đề</label>
          <Textarea
            value={contactPage.hero.subtitle}
            onChange={(e) => updateContactPage('hero', { ...contactPage.hero, subtitle: e.target.value })}
            placeholder="Chúng tôi luôn sẵn sàng lắng nghe..."
            className="border-2 focus:border-blue-500 min-h-[80px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Hero</label>
          <ImageUploader
            value={contactPage.hero.image}
            onChange={(url) => updateContactPage('hero', { ...contactPage.hero, image: url })}
            label="Ảnh Hero"
          />
        </div>
      </div>

      {/* Contact Cards */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>📇</span> Thông Tin Liên Hệ
        </h3>
        
        {(contactPage.contactCards || []).map((card, index) => (
          <div key={index} className="p-4 bg-white rounded-lg border-2 border-gray-100 space-y-3">
            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-lg">{card.icon === 'Phone' ? '📞' : card.icon === 'Mail' ? '📧' : '📍'}</span>
              Card {index + 1}: {card.title}
            </h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <Input
                value={card.title}
                onChange={(e) => updateContactCard(index, 'title', e.target.value)}
                placeholder="Điện thoại / Email / Địa chỉ"
                className="border-2 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <Input
                value={card.description}
                onChange={(e) => updateContactCard(index, 'description', e.target.value)}
                placeholder="Gọi cho chúng tôi để được tư vấn..."
                className="border-2 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị</label>
              <Input
                value={card.value}
                onChange={(e) => updateContactCard(index, 'value', e.target.value)}
                placeholder="(+84) 123 456 789 / email@example.com / Địa chỉ..."
                className="border-2 focus:border-green-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Map Embed */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-orange-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <span>🗺️</span> Google Maps
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map Embed URL
            <span className="text-xs text-gray-500 ml-2">(Google Maps → Share → Embed a map)</span>
          </label>
          <Textarea
            value={contactPage.mapEmbedUrl}
            onChange={(e) => updateContactPage('mapEmbedUrl', e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="border-2 focus:border-orange-500 min-h-[100px] font-mono text-sm"
          />
        </div>
        {contactPage.mapEmbedUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <iframe
              src={contactPage.mapEmbedUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// About Partners Editor Component
function AboutPartnersEditor({
  content,
  setContent,
}: {
  content: AdminContent
  setContent: (content: AdminContent) => void
}) {
  const [logoForm, setLogoForm] = useState({ name: '', logo: '' })
  const partners = content.partners || []
  const aboutPartners = content.pages?.aboutPartners || {
    hero: { title: '', subtitle: '', backgroundImage: '' },
    intro: { title: '', description: '' },
    benefits: [],
    cta: { title: '', description: '', buttonText: '' },
  }

  const updateField = (path: string, value: any) => {
    const keys = path.split('.')
    const updated = { ...aboutPartners }
    let current: any = updated
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setContent({
      ...content,
      pages: { ...content.pages, aboutPartners: updated },
    })
  }

  const addBenefit = () => {
    updateField('benefits', [...aboutPartners.benefits, { icon: '🌿', title: '', description: '' }])
  }

  const removeBenefit = (index: number) => {
    const newBenefits = aboutPartners.benefits.filter((_, i) => i !== index)
    updateField('benefits', newBenefits)
  }

  const updateBenefit = (index: number, field: string, value: string) => {
    const newBenefits = [...aboutPartners.benefits]
    newBenefits[index] = { ...newBenefits[index], [field]: value }
    updateField('benefits', newBenefits)
  }

  // Partner Logo Management
  const addPartnerLogo = () => {
    if (!logoForm.name || !logoForm.logo) {
      alert('Vui lòng nhập tên và logo đối tác')
      return
    }
    const newPartner = {
      id: Math.max(...partners.map(p => p.id), 0) + 1,
      name: logoForm.name,
      logo: logoForm.logo,
    }
    setContent({
      ...content,
      partners: [...partners, newPartner],
    })
    setLogoForm({ name: '', logo: '' })
  }

  const removePartnerLogo = (id: number) => {
    setContent({
      ...content,
      partners: partners.filter(p => p.id !== id),
    })
  }

  const updatePartnerLogo = (id: number, field: string, value: string) => {
    setContent({
      ...content,
      partners: partners.map(p => p.id === id ? { ...p, [field]: value } : p),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">🤝</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trang Đối Tác</h2>
          <p className="text-sm text-gray-500">Chỉnh sửa thông tin đối tác chiến lược và logo</p>
        </div>
      </div>

      {/* Partner Logos Section */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🏢 Logo Đối Tác (Carousel)</h3>
        <p className="text-sm text-gray-600">Logo này sẽ xuất hiện trong carousel ở trang chủ và trang đối tác</p>
        
        {/* Add Partner Form */}
        <div className="bg-white p-4 rounded-lg border-2 space-y-3">
          <h4 className="font-semibold text-sm text-gray-700">➕ Thêm logo đối tác mới</h4>
          <Input 
            value={logoForm.name} 
            onChange={(e) => setLogoForm({ ...logoForm, name: e.target.value })} 
            placeholder="Tên đối tác (VD: Công ty ABC)" 
            className="border-2"
          />
          <ImageUploader 
            value={logoForm.logo} 
            onChange={(url) => setLogoForm({ ...logoForm, logo: url })} 
            label="Logo đối tác" 
          />
          <Button onClick={addPartnerLogo} className="w-full bg-purple-600 hover:bg-purple-700">
            ➕ Thêm logo
          </Button>
        </div>

        {/* Partner List */}
        <div className="space-y-3">
          {partners.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có logo đối tác nào</p>
          ) : (
            partners.map((partner) => (
              <div key={partner.id} className="bg-white p-4 rounded-lg border-2 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-700">{partner.name || `Đối tác #${partner.id}`}</h4>
                  <Button onClick={() => removePartnerLogo(partner.id)} size="sm" variant="destructive">
                    🗑️ Xóa
                  </Button>
                </div>
                <Input 
                  value={partner.name} 
                  onChange={(e) => updatePartnerLogo(partner.id, 'name', e.target.value)} 
                  placeholder="Tên đối tác" 
                />
                <ImageUploader 
                  value={partner.logo} 
                  onChange={(url) => updatePartnerLogo(partner.id, 'logo', url)} 
                  label="Logo" 
                />
                {partner.logo && (
                  <div className="bg-gray-100 p-2 rounded">
                    <img src={partner.logo} alt={partner.name} className="h-20 object-contain mx-auto" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🎯 Hero Section</h3>
        <Input value={aboutPartners.hero.title} onChange={(e) => updateField('hero.title', e.target.value)} placeholder="Đối tác chiến lược" />
        <Textarea value={aboutPartners.hero.subtitle} onChange={(e) => updateField('hero.subtitle', e.target.value)} placeholder="Cùng phát triển..." />
        <ImageUploader value={aboutPartners.hero.backgroundImage} onChange={(url) => updateField('hero.backgroundImage', url)} label="Ảnh nền Hero" />
      </div>

      {/* Intro */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">📝 Giới thiệu</h3>
        <Input value={aboutPartners.intro.title} onChange={(e) => updateField('intro.title', e.target.value)} placeholder="Đối tác của chúng tôi" />
        <Textarea value={aboutPartners.intro.description} onChange={(e) => updateField('intro.description', e.target.value)} placeholder="Mô tả..." />
      </div>

      {/* Benefits */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-yellow-50 p-6 rounded-xl border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">✨ Quyền lợi đối tác</h3>
          <Button onClick={addBenefit} size="sm" className="bg-green-600 hover:bg-green-700">+ Thêm quyền lợi</Button>
        </div>
        {aboutPartners.benefits.map((benefit, i) => (
          <div key={i} className="p-4 bg-white rounded-lg border-2 space-y-2">
            <div className="flex justify-between">
              <h4 className="font-semibold">Quyền lợi {i + 1}</h4>
              <Button onClick={() => removeBenefit(i)} size="sm" variant="destructive">Xóa</Button>
            </div>
            <Input value={benefit.icon} onChange={(e) => updateBenefit(i, 'icon', e.target.value)} placeholder="🌿" />
            <Input value={benefit.title} onChange={(e) => updateBenefit(i, 'title', e.target.value)} placeholder="Tiêu đề" />
            <Textarea value={benefit.description} onChange={(e) => updateBenefit(i, 'description', e.target.value)} placeholder="Mô tả..." />
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-orange-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">📢 Call to Action</h3>
        <Input value={aboutPartners.cta.title} onChange={(e) => updateField('cta.title', e.target.value)} placeholder="Sẵn sàng hợp tác?" />
        <Textarea value={aboutPartners.cta.description} onChange={(e) => updateField('cta.description', e.target.value)} placeholder="Hãy liên hệ..." />
        <Input value={aboutPartners.cta.buttonText} onChange={(e) => updateField('cta.buttonText', e.target.value)} placeholder="Liên hệ ngay" />
      </div>
    </div>
  )
}

// About Mission Editor Component  
function AboutMissionEditor({ content, setContent }: { content: AdminContent; setContent: (content: AdminContent) => void }) {
  const aboutMission = content.pages?.aboutMission || {
    hero: { image: '' },
    companyName: '',
    vision: '',
    mission: { description: '', points: [] },
    coreValues: [],
  }

  const updateField = (path: string, value: any) => {
    const keys = path.split('.')
    const updated = { ...aboutMission }
    let current: any = updated
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value
    setContent({ ...content, pages: { ...content.pages, aboutMission: updated } })
  }

  const addMissionPoint = () => updateField('mission.points', [...(aboutMission.mission?.points || []), ''])
  const removeMissionPoint = (i: number) => updateField('mission.points', (aboutMission.mission?.points || []).filter((_, idx) => idx !== i))
  const updateMissionPoint = (i: number, v: string) => {
    const pts = [...(aboutMission.mission?.points || [])]
    pts[i] = v
    updateField('mission.points', pts)
  }

  const addCoreValue = () => updateField('coreValues', [...(aboutMission.coreValues || []), ''])
  const removeCoreValue = (i: number) => updateField('coreValues', (aboutMission.coreValues || []).filter((_, idx) => idx !== i))
  const updateCoreValue = (i: number, v: string) => {
    const vals = [...(aboutMission.coreValues || [])]
    vals[i] = v
    updateField('coreValues', vals)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">🎯</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trang Sứ Mệnh</h2>
          <p className="text-sm text-gray-500">Tầm nhìn, Sứ mệnh, Giá trị cốt lõi</p>
        </div>
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🖼️ Hero Image</h3>
        <ImageUploader value={aboutMission.hero.image} onChange={(url) => updateField('hero.image', url)} label="Ảnh Hero" />
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🏢 Thông tin công ty</h3>
        <Input value={aboutMission.companyName} onChange={(e) => updateField('companyName', e.target.value)} placeholder="CÔNG TY CỔ PHẦN CAMICO" />
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-yellow-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🔭 Tầm nhìn</h3>
        <Textarea value={aboutMission.vision} onChange={(e) => updateField('vision', e.target.value)} placeholder="Trở thành thương hiệu dẫn đầu..." className="min-h-[120px]" />
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-orange-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🎯 Sứ mệnh</h3>
        <Textarea value={aboutMission.mission.description} onChange={(e) => updateField('mission.description', e.target.value)} placeholder="Mang đến giải pháp..." className="min-h-[100px]" />
        <div className="flex justify-between items-center mt-4">
          <h4 className="font-semibold">Điểm nhấn sứ mệnh:</h4>
          <Button onClick={addMissionPoint} size="sm" className="bg-orange-600">+ Thêm điểm</Button>
        </div>
        {(aboutMission.mission?.points || []).map((pt, i) => (
          <div key={i} className="flex gap-2">
            <Input value={pt} onChange={(e) => updateMissionPoint(i, e.target.value)} placeholder="Vì sức khỏe..." />
            <Button onClick={() => removeMissionPoint(i)} size="sm" variant="destructive">Xóa</Button>
          </div>
        ))}
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">💎 Giá trị cốt lõi</h3>
          <Button onClick={addCoreValue} size="sm" className="bg-purple-600">+ Thêm giá trị</Button>
        </div>
        {(aboutMission.coreValues || []).map((val, i) => (
          <div key={i} className="flex gap-2">
            <Input value={val} onChange={(e) => updateCoreValue(i, e.target.value)} placeholder="Trung thực & Trách nhiệm" />
            <Button onClick={() => removeCoreValue(i)} size="sm" variant="destructive">Xóa</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// About Message Editor Component
function AboutMessageEditor({ content, setContent }: { content: AdminContent; setContent: (content: AdminContent) => void }) {
  const aboutMessage = content.pages?.aboutMessage || {
    hero: { image: '' },
    title: '',
    subtitle: '',
    greeting: '',
    paragraphs: [],
    quote: '',
    signature: '',
  }

  const updateField = (field: string, value: any) => {
    setContent({ ...content, pages: { ...content.pages, aboutMessage: { ...aboutMessage, [field]: value } } })
  }

  const addParagraph = () => updateField('paragraphs', [...aboutMessage.paragraphs, ''])
  const removeParagraph = (i: number) => updateField('paragraphs', aboutMessage.paragraphs.filter((_, idx) => idx !== i))
  const updateParagraph = (i: number, v: string) => {
    const paras = [...aboutMessage.paragraphs]
    paras[i] = v
    updateField('paragraphs', paras)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">💬</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trang Thông Điệp</h2>
          <p className="text-sm text-gray-500">Thư ngỏ từ nhà sáng lập</p>
        </div>
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🖼️ Hero Image</h3>
        <ImageUploader value={aboutMessage.hero.image} onChange={(url) => updateField('hero', { image: url })} label="Ảnh Hero" />
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">📝 Tiêu đề</h3>
        <Input value={aboutMessage.title} onChange={(e) => updateField('title', e.target.value)} placeholder="THƯ NGỞ" />
        <Input value={aboutMessage.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Thông điệp nhà sáng lập" />
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-yellow-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">👋 Lời chào</h3>
        <Input value={aboutMessage.greeting} onChange={(e) => updateField('greeting', e.target.value)} placeholder="Kính gửi: Quý khách hàng..." />
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-orange-50 p-6 rounded-xl border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">📄 Nội dung thư</h3>
          <Button onClick={addParagraph} size="sm" className="bg-orange-600">+ Thêm đoạn</Button>
        </div>
        {aboutMessage.paragraphs.map((para, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Đoạn {i + 1}</label>
              <Button onClick={() => removeParagraph(i)} size="sm" variant="destructive">Xóa</Button>
            </div>
            <Textarea value={para} onChange={(e) => updateParagraph(i, e.target.value)} placeholder="Nội dung đoạn văn..." className="min-h-[100px]" />
          </div>
        ))}
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">💭 Quote nổi bật</h3>
        <Textarea value={aboutMessage.quote} onChange={(e) => updateField('quote', e.target.value)} placeholder="Biến phụ phẩm thành giá trị..." className="min-h-[80px]" />
      </div>

      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-pink-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">✍️ Chữ ký</h3>
        <Input value={aboutMessage.signature} onChange={(e) => updateField('signature', e.target.value)} placeholder="CAMICO" />
      </div>
    </div>
  )
}

// Products Page Editor Component
function ProductsPageEditor({ content, setContent }: { content: AdminContent; setContent: (content: AdminContent) => void }) {
  const productsPage = content.pages?.products || {
    hero: { title: '', subtitle: '', backgroundImage: '' },
    categories: [],
    productList: [],
  }

  const updateField = (field: string, value: any) => {
    setContent({ ...content, pages: { ...content.pages, products: { ...productsPage, [field]: value } } })
  }

  const addCategory = () => updateField('categories', [...productsPage.categories, { id: '', name: '', icon: '📦' }])
  const removeCategory = (i: number) => updateField('categories', productsPage.categories.filter((_, idx) => idx !== i))
  const updateCategory = (i: number, field: string, v: string) => {
    const cats = [...productsPage.categories]
    cats[i] = { ...cats[i], [field]: v }
    updateField('categories', cats)
  }

  const addProduct = () => updateField('productList', [...productsPage.productList, { id: Date.now(), name: '', category: '', weight: '', description: '', icon: '📦' }])
  const removeProduct = (i: number) => updateField('productList', productsPage.productList.filter((_, idx) => idx !== i))
  const updateProduct = (i: number, field: string, v: any) => {
    const prods = [...productsPage.productList]
    prods[i] = { ...prods[i], [field]: v }
    updateField('productList', prods)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b-2 border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">🛍️</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Trang Sản Phẩm</h2>
          <p className="text-sm text-gray-500">Quản lý danh mục và sản phẩm</p>
        </div>
      </div>

      {/* Hero */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border">
        <h3 className="font-semibold text-gray-800">🎯 Hero Section</h3>
        <Input value={productsPage.hero.title} onChange={(e) => updateField('hero', { ...productsPage.hero, title: e.target.value })} placeholder="SẢN PHẨM CỦA CAMICO" />
        <Textarea value={productsPage.hero.subtitle} onChange={(e) => updateField('hero', { ...productsPage.hero, subtitle: e.target.value })} placeholder="Mô tả..." />
        <ImageUploader value={productsPage.hero.backgroundImage} onChange={(url) => updateField('hero', { ...productsPage.hero, backgroundImage: url })} label="Ảnh nền" />
      </div>

      {/* Categories */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-green-50 p-6 rounded-xl border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">📂 Danh mục sản phẩm</h3>
          <Button onClick={addCategory} size="sm" className="bg-green-600">+ Thêm danh mục</Button>
        </div>
        {productsPage.categories.map((cat, i) => (
          <div key={i} className="p-4 bg-white rounded-lg border-2 space-y-2">
            <div className="flex justify-between">
              <h4 className="font-semibold">Danh mục {i + 1}</h4>
              <Button onClick={() => removeCategory(i)} size="sm" variant="destructive">Xóa</Button>
            </div>
            <Input value={cat.id} onChange={(e) => updateCategory(i, 'id', e.target.value)} placeholder="heo-thit" />
            <Input value={cat.name} onChange={(e) => updateCategory(i, 'name', e.target.value)} placeholder="Thức ăn cho heo" />
            <Input value={cat.icon} onChange={(e) => updateCategory(i, 'icon', e.target.value)} placeholder="🐷" />
          </div>
        ))}
      </div>

      {/* Products */}
      <div className="space-y-4 bg-gradient-to-br from-gray-50 to-orange-50 p-6 rounded-xl border">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">📦 Danh sách sản phẩm</h3>
          <Button onClick={addProduct} size="sm" className="bg-orange-600">+ Thêm sản phẩm</Button>
        </div>
        {productsPage.productList.map((prod, i) => (
          <div key={i} className="p-4 bg-white rounded-lg border-2 space-y-2">
            <div className="flex justify-between">
              <h4 className="font-semibold">Sản phẩm {i + 1}</h4>
              <Button onClick={() => removeProduct(i)} size="sm" variant="destructive">Xóa</Button>
            </div>
            <Input value={prod.name} onChange={(e) => updateProduct(i, 'name', e.target.value)} placeholder="Tên sản phẩm" />
            <Input value={prod.category} onChange={(e) => updateProduct(i, 'category', e.target.value)} placeholder="heo-thit / ga" />
            <Input value={prod.weight} onChange={(e) => updateProduct(i, 'weight', e.target.value)} placeholder="25kg" />
            <Input value={prod.icon} onChange={(e) => updateProduct(i, 'icon', e.target.value)} placeholder="🐷" />
            <Textarea value={prod.description} onChange={(e) => updateProduct(i, 'description', e.target.value)} placeholder="Mô tả sản phẩm..." className="min-h-[80px]" />
          </div>
        ))}
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
          <p className="text-sm text-gray-500">Quản lý nội dung website CAMICO dễ dàng</p>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🚀</span> Bắt Đầu Nhanh
        </h3>
        <div className="space-y-3 text-gray-700">
          <p className="leading-relaxed">
            Chào mừng đến với Admin Panel của CAMICO! Bạn có thể quản lý toàn bộ nội dung website 
            mà không cần kiến thức lập trình. Mọi thay đổi sẽ được lưu và hiển thị ngay lập tức.
          </p>
          <div className="bg-white p-4 rounded-lg border border-blue-200 mt-3">
            <h4 className="font-semibold text-gray-800 mb-2">3 Bước Đơn Giản:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-sm">
              <li>Chọn trang cần chỉnh sửa từ <strong>menu bên trái</strong></li>
              <li>Cập nhật nội dung: văn bản, hình ảnh, danh sách...</li>
              <li>Nhấn nút <strong className="text-green-600">💾 Lưu Thay Đổi</strong> ở header</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Navigation Guide */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🧭</span> Menu & Tìm Kiếm
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p><strong>Menu sidebar:</strong> Các trang được chia thành 4 nhóm - Bắt đầu, Trang chủ, Trang riêng, và Về chúng tôi.</p>
          <p><strong>Tìm kiếm:</strong> Gõ từ khóa vào ô tìm kiếm để lọc nhanh trang cần chỉnh sửa.</p>
          <p><strong>Mobile:</strong> Nhấn nút ☰ ở góc trên để mở/đóng menu.</p>
        </div>
      </div>

      {/* Page Categories */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border border-orange-200">
          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🏠</span> Trang Chủ
          </h3>
          <div className="space-y-1.5 text-sm text-gray-700">
            <div>• <strong>Hero:</strong> Banner chính</div>
            <div>• <strong>Giới thiệu:</strong> Thông tin công ty</div>
            <div>• <strong>Sản phẩm:</strong> Danh sách sản phẩm</div>
            <div>• <strong>Tin tức:</strong> Bài viết</div>
            <div>• <strong>Đánh giá:</strong> Phản hồi khách hàng</div>
            <div>• <strong>Thư viện:</strong> Gallery ảnh</div>
            <div>• <strong>Liên hệ:</strong> Thông tin liên lạc</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-xl border border-green-200">
          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📄</span> Trang Riêng
          </h3>
          <div className="space-y-1.5 text-sm text-gray-700">
            <div>• <strong>Liên Hệ:</strong> Form liên hệ, bản đồ</div>
            <div>• <strong>Sản Phẩm:</strong> Catalog sản phẩm</div>
            <div>• <strong>Đối tác:</strong> Logo & thông tin đối tác</div>
            <div>• <strong>Sứ mệnh:</strong> Vision & Mission</div>
            <div>• <strong>Thông điệp:</strong> Lời nhắn từ lãnh đạo</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border-l-4 border-red-400 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔘</span> Các Nút Quan Trọng
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💾</span>
              <h4 className="font-semibold text-green-700">Lưu</h4>
            </div>
            <p className="text-sm text-gray-600">Lưu thay đổi lên server. Nút sẽ nhấp nháy màu vàng khi có thay đổi chưa lưu.</p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔄</span>
              <h4 className="font-semibold text-orange-700">Reset</h4>
            </div>
            <p className="text-sm text-gray-600">Đặt lại về nội dung mặc định. <strong className="text-red-600">Không thể hoàn tác!</strong></p>
          </div>

          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">➕</span>
              <h4 className="font-semibold text-blue-700">Thêm</h4>
            </div>
            <p className="text-sm text-gray-600">Thêm mới item (sản phẩm, tin tức, đối tác...).</p>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-400 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📸</span> Upload Hình Ảnh
        </h3>
        <div className="bg-white p-4 rounded-lg border border-purple-200">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Tìm ô "Chọn hoặc kéo thả hình ảnh"</li>
            <li>Click hoặc kéo thả file ảnh (JPG, PNG, WebP, max 4.5MB)</li>
            <li>Hình sẽ tự động upload và URL được điền vào</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-xs text-gray-500">
              💡 <strong>Tip:</strong> Dùng ảnh dưới 2MB, độ phân giải phù hợp để website load nhanh.
            </p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>ℹ️</span> Thông Tin Hệ Thống
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600"><strong>Version:</strong> 1.0</p>
            <p className="text-gray-600"><strong>Release:</strong> November 2025</p>
            <p className="text-gray-600"><strong>Developer:</strong> minhdq25</p>
          </div>
          <div>
            <p className="text-gray-600"><strong>Framework:</strong> Next.js 16</p>
            <p className="text-gray-600"><strong>Database:</strong> Vercel KV</p>
            <p className="text-gray-600"><strong>Images:</strong> Cloudinary</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-l-4 border-blue-500 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📞</span> Cần Hỗ Trợ?
        </h3>
        <p className="text-sm text-gray-600 mb-4">Liên hệ với developer nếu bạn gặp vấn đề hoặc cần hỗ trợ:</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <a 
            href="https://m.facebook.com/minhgtr25" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-colors group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Facebook</p>
              <p className="text-sm font-semibold text-gray-800">Quang Minh</p>
            </div>
          </a>

          <a 
            href="mailto:dquangminh0103@gmail.com"
            className="flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-red-200 hover:border-red-400 transition-colors group"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-semibold text-gray-800">dquangminh0103</p>
            </div>
          </a>

          <a 
            href="tel:0971653005"
            className="flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-green-200 hover:border-green-400 transition-colors group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Điện thoại</p>
              <p className="text-sm font-semibold text-gray-800">097 165 3005</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
