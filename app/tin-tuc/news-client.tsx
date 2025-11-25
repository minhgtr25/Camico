'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

interface NewsArticle {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  featured?: boolean
}

interface NewsClientProps {
  articles: NewsArticle[]
}

export default function NewsClient({ articles }: NewsClientProps) {
  const featuredArticle = articles.find(article => article.featured)
  const regularArticles = articles.filter(article => !article.featured)

  return (
    <main className="flex-1">
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-12">
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#2d5016]/10">
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
                  <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-white to-[#f5f5dc]/30">
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 text-[#2d5016]" />
                      <span className="text-sm font-medium">{featuredArticle.date}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#2d5016] mb-4 leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <Link 
                      href={`/tin-tuc/${featuredArticle.id}`} 
                      className="inline-flex items-center gap-2 text-white bg-gradient-to-r from-[#2d5016] to-[#3d6826] px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 w-fit"
                    >
                      Đọc thêm
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* All Regular Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {regularArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-[#2d5016]/10"
              >
                <div className="relative h-48">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-[#2d5016] to-[#3d6826] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-gradient-to-br from-white to-[#f5f5dc]/20">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Calendar className="w-4 h-4 text-[#2d5016]" />
                    <span className="text-sm font-medium">{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2d5016] mb-3 leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>
                  <Link 
                    href={`/tin-tuc/${article.id}`} 
                    className="inline-flex items-center gap-2 text-[#2d5016] font-semibold hover:text-[#3d6826] hover:gap-3 transition-all duration-300 mt-auto group"
                  >
                    Đọc thêm
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
