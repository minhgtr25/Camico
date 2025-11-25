import { fetchAdminContentFromServer } from '@/lib/admin-content'
import { newsArticles as fallbackNews } from '@/lib/news-data'
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

  return <NewsClient articles={articles} />
}
