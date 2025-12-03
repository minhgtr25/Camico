"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { NewsArticle } from '@/lib/types'
import { ArrowLeft, Share2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

// Lightweight client-side sanitizer as a fallback when DOMPurify isn't installed.
// It strips <script> and <style> tags and removes event handler attributes (on*).
function sanitizeHtmlFallback(raw: string) {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(raw, 'text/html')
    // remove scripts and styles
    for (const n of Array.from(doc.querySelectorAll('script, style'))) n.remove()
    // remove event handler attributes and javascript: hrefs
    for (const el of Array.from(doc.querySelectorAll('*'))) {
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase()
        const val = attr.value || ''
        if (name.startsWith('on')) el.removeAttribute(attr.name)
        if ((name === 'href' || name === 'src') && val.trim().toLowerCase().startsWith('javascript:')) el.removeAttribute(attr.name)
      }
    }
    return doc.body.innerHTML
  } catch (e) {
    console.error('sanitize fallback error', e)
    return ''
  }
}

export default function ArticlePage() {
  const params = useParams()
  const idStr = params?.id
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [related, setRelated] = useState<NewsArticle[]>([])
  const [sanitizedHtml, setSanitizedHtml] = useState<string>('')
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([])
  const [readingTime, setReadingTime] = useState<number>(0)

  useEffect(() => {
    async function loadArticle() {
      try {
        setIsLoading(true)
        if (!idStr) return
        
        // Fetch from server API instead of localStorage
        const response = await fetch('/api/admin/content', {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }
        
        const admin = await response.json()
        const idClean = Array.isArray(idStr) ? idStr[0] : (idStr ?? '')
        const idNum = Number.parseInt(idClean, 10)
        const found = admin.news?.find((n: NewsArticle) => n.id === idNum)
        
        if (found) {
          setArticle(found)
        } else {
          setArticle(null)
        }

        // compute related articles (latest 3 excluding current)
        const rel = (admin.news || []).filter((n: NewsArticle) => n.id !== idNum).slice(-3).reverse()
        setRelated(rel)
      } catch (e) {
        console.error('Error loading article', e)
        setArticle(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadArticle()
  }, [idStr])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      const scrolled = el.scrollTop
      const pct = total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0
      setProgress(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // sanitize article content, build TOC and reading time
  useEffect(() => {
    if (!article) return
    const raw = article.content ?? `<p>${article.excerpt ?? ''}</p>`
    let clean = ''
    try {
      const dp = (globalThis as any)?.DOMPurify
      if (dp && typeof dp.sanitize === 'function') {
        clean = dp.sanitize(raw)
      } else {
        clean = sanitizeHtmlFallback(raw)
      }
    } catch (e) {
      console.error('sanitize error', e)
      clean = sanitizeHtmlFallback(raw)
    }
    setSanitizedHtml(clean)

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(clean, 'text/html')
      const headings = Array.from(doc.querySelectorAll('h1,h2,h3'))
      const tocArr = headings.map((h) => {
        const text = h.textContent?.trim() || ''
        const id = h.id || text.toLowerCase().replaceAll(/[^a-z0-9]+/gi, '-').replaceAll(/(^-|-$)/g, '')
        if (!h.id) h.id = id
        return { id, text, level: Number.parseInt(h.tagName.slice(1), 10) }
      })
      setToc(tocArr)

      const words = doc.body.textContent?.split(/\s+/).filter(Boolean).length || 0
      const minutes = Math.max(1, Math.round(words / 200))
      setReadingTime(minutes)
    } catch (e) {
      console.error('TOC parse error', e)
    }
  }, [article])

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-3xl w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!article) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-3xl w-full text-center">
            <h2 className="text-2xl font-bold">Bài viết không tìm thấy</h2>
            <p className="text-gray-600 mt-2">Có thể bài viết chưa được xuất bản hoặc ID không hợp lệ.</p>
            <div className="mt-4">
              <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-[#2d5016] font-semibold">
                <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  

  const share = (platform: 'twitter' | 'facebook' | 'copy') => {
    const url = (globalThis as any)?.location?.href ?? ''
    if (platform === 'copy') {
      try {
        ;(globalThis as any).navigator?.clipboard?.writeText(url)
        toast({ description: 'Đã sao chép liên kết' })
      } catch (e) {
        console.error(e)
        toast({ description: 'Không thể sao chép liên kết', variant: 'destructive' })
      }
      return
    }
    const text = encodeURIComponent(article.title)
    const shareUrl = platform === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`
      : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    ;(globalThis as any).open(shareUrl, '_blank', 'noopener')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
      {/* progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div className="h-1 bg-[#2d5016] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Quay lại</span>
              </Link>
              <span className="text-xs text-gray-500">{article.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => share('twitter')} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <Share2 className="w-4 h-4" /> Chia sẻ
              </button>
              <button onClick={() => share('copy')} className="text-sm text-gray-500">Sao chép liên kết</button>
            </div>
          </div>

          <header className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#16321a] leading-tight mb-2">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div>{article.date}</div>
              <div>• {readingTime} phút đọc</div>
            </div>
          </header>

          {/* excerpt / lead */}
          {article.excerpt && (
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">{article.excerpt}</p>
          )}

          {article.image && (
            <div className="mb-6">
              <img src={article.image} alt={article.title} className="w-full h-72 md:h-96 object-cover rounded-lg shadow" />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {article.contentBlocks && article.contentBlocks.length > 0 ? (
              // New content blocks structure
              <div className="space-y-6">
                {article.contentBlocks.map((block) => {
                  if (block.type === 'text' && block.content) {
                    return (
                      <div key={block.id} dangerouslySetInnerHTML={{ __html: sanitizeHtmlFallback(block.content) }} />
                    )
                  }
                  if (block.type === 'image' && block.imageUrl) {
                    return (
                      <figure key={block.id} className="my-8">
                        <img 
                          src={block.imageUrl} 
                          alt={block.imageAlt || block.imageCaption || 'Article image'} 
                          className="w-full rounded-lg shadow-lg"
                        />
                        {block.imageCaption && (
                          <figcaption className="mt-3 text-center text-sm text-gray-600 italic">
                            {block.imageCaption}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }
                  return null
                })}
              </div>
            ) : (
              // Fallback to legacy content
              <article dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            )}
          </div>

          <div className="mt-12 border-t pt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Bạn thấy hữu ích? Hãy chia sẻ bài viết này.</div>
            <div className="flex items-center gap-3">
              <button onClick={() => share('facebook')} className="px-3 py-2 bg-blue-600 text-white rounded">Facebook</button>
              <button onClick={() => share('twitter')} className="px-3 py-2 bg-sky-500 text-white rounded">Twitter</button>
            </div>
          </div>
        </article>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-gray-50 p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Tóm tắt</h4>
              <p className="text-sm text-gray-700">{article.excerpt}</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
                {toc.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Mục lục</h4>
                    <nav className="text-sm text-gray-600 space-y-2">
                      {toc.map((t) => (
                        <a key={t.id} href={`#${t.id}`} className="block" style={{ marginLeft: `${(t.level - 1) * 12}px` }}>{t.text}</a>
                      ))}
                    </nav>
                  </div>
                )}
                <h4 className="font-semibold mb-3">Bài viết liên quan</h4>
              <div className="space-y-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/tin-tuc/${r.id}`} className="flex items-start gap-3">
                    {r.image && <img src={r.image} alt={r.title} className="w-16 h-12 object-cover rounded" />}
                    <div>
                      <div className="text-sm font-semibold text-[#16321a]">{r.title}</div>
                      <div className="text-xs text-gray-500">{r.date}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded shadow">
              <h4 className="font-semibold mb-2">Đăng ký nhận tin</h4>
              <p className="text-sm text-gray-600 mb-3">Nhận thông báo khi có bài viết mới.</p>
              <form onSubmit={(e) => { e.preventDefault(); toast({ description: 'Cảm ơn!' }); }} className="flex gap-2">
                <input type="email" placeholder="Email của bạn" className="flex-1 border px-3 py-2 rounded" />
                <button type="submit" className="bg-[#2d5016] text-white px-3 py-2 rounded">Đăng ký</button>
              </form>
            </div>
          </div>
        </aside>
      </div>
      </main>
      <Footer />
    </>
  )
}
