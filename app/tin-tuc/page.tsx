import { fetchAdminContentFromServer } from '@/lib/admin-content'
import { newsArticles as fallbackNews } from '@/lib/news-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import NewsClient from './news-client'

export const dynamic = 'force-dynamic'

export default async function TinTucPage() {
  const adminContent = await fetchAdminContentFromServer()
  
  // Merge fallback news with admin news (admin overrides by id)
  const map = new Map<number, any>()
  for (const article of fallbackNews) {
    map.set(article.id, article)
  }
  
  if (adminContent?.news && Array.isArray(adminContent.news)) {
    for (const article of adminContent.news) {
      map.set(article.id, { ...(map.get(article.id) ?? article), ...article })
    }
  }
  
  const articles = Array.from(map.values())

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
