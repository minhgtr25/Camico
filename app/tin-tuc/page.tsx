import { defaultAdminContent } from '@/lib/admin-content'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import NewsClient from './news-client'
import { kv } from '@vercel/kv'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getAdminContent() {
  // Chỉ gọi KV khi đang runtime, không phải build time
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === undefined) {
    // Build time - return default
    return defaultAdminContent
  }
  
  try {
    const content = await kv.get('admin-content')
    return content || defaultAdminContent
  } catch (error) {
    console.error('Error fetching admin content:', error)
    return defaultAdminContent
  }
}

export default async function TinTucPage() {
  const adminContent = await getAdminContent()
  
  // Only use articles from admin content (no fallback)
  // This ensures only articles that exist in admin panel are displayed
  const articles = (adminContent?.news && Array.isArray(adminContent.news)) 
    ? adminContent.news 
    : []

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5dc]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-[#f5f5dc] py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2d5016] mb-4">📰 Tin Tức CAMICO</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Cập nhật tin tức mới nhất về sản phẩm, công nghệ và xu hướng chăn nuôi bền vững
          </p>
        </div>
      </section>

      <NewsClient articles={articles} />
      
      <Footer />
    </div>
  )
}
