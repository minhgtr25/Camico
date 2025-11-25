'use client'

import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  category: string
  featured?: boolean
}

export function NewsSection({ content }: Readonly<{ content: NewsArticle[] }>) {
  // Get only ONE featured article (the one with featured=true)
  const featuredArticle = useMemo(() => {
    return content?.find(article => article.featured === true)
  }, [content])

  // Parse date strings in multiple formats (ISO yyyy-mm-dd or dd/mm/yyyy)
  const parseDate = (d?: string | number | Date) => {
    if (!d) return new Date(0)
    if (d instanceof Date) return d
    const s = String(d).trim()
    // ISO-like (2024-01-15)
    const iso = Date.parse(s)
    if (!Number.isNaN(iso)) return new Date(iso)
    // dd/mm/yyyy or d/m/yyyy
    const parts = s.split('/')
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts
      const day = Number.parseInt(dd, 10)
      const month = Number.parseInt(mm, 10) - 1
      const year = Number.parseInt(yyyy, 10)
      if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
        return new Date(year, month, day)
      }
    }
    // Fallback to epoch 0 on parse failure
    return new Date(0)
  }

  // Regular articles: exclude featured article and sort by date descending (newest first)
  const regularArticles = useMemo(() => {
    const list = content.filter(article => article.id !== featuredArticle?.id)
    return list.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
  }, [content, featuredArticle])

  // On landing page show only the 3 newest regular articles
  const visibleRegular = useMemo(() => regularArticles.slice(0, 3), [regularArticles])
  
  if (!content || content.length === 0) {
    return null
  }

  return (
    <section className="py-16 md:py-24 bg-[#f5f5dc]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#2d5016] mb-4">
            Tin tức & Sự kiện
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất về sản phẩm, công nghệ và các hoạt động của CAMICO
          </p>
        </div>

        {/* Featured Article - Only ONE */}
        {featuredArticle && (
          <div className="mb-12">
            <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={featuredArticle.image || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-[#2d5016] to-[#3d6826] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ {featuredArticle.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{featuredArticle.date}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#2d5016] mb-4 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <Link href={`/tin-tuc/${featuredArticle.id}`} className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-[#2d5016] to-[#3d6826] px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 w-fit">
                    Đọc thêm
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visibleRegular.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-48">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#2d5016] text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-[#2d5016] mb-3 leading-tight line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <Link href={`/tin-tuc/${article.id}`} className="inline-flex items-center gap-2 text-[#2d5016] font-semibold hover:gap-3 transition-all duration-300 mt-auto">
                  Đọc thêm
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/tin-tuc">
            <button className="bg-[#2d5016] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3d6826] transition-colors duration-300 shadow-lg hover:shadow-xl">
              Xem tất cả tin tức
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
