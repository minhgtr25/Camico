import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ImageGallery } from "@/components/image-gallery"
import { FeedbackSection } from "@/components/feedback-section"
import { PartnersSection } from "@/components/partners-section"
import { NewsSection } from "@/components/news-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { defaultAdminContent } from "@/lib/admin-content"
import { kv } from '@vercel/kv'

// Force dynamic rendering
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

export default async function Page() {
  const content = await getAdminContent()
  
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection content={{
        backgroundImage: content.pages.home.hero.image,
        title: content.pages.home.hero.title,
        subtitle: content.pages.home.hero.subtitle.replace('\n', '<br />'),
        buttonText: content.pages.home.hero.buttonText
      }} />
      <AboutSection content={{
        icon: content.pages.home.about.emoji,
        title: content.pages.home.about.title,
        description: content.pages.home.about.content.map(p => `<p>${p}</p>`).join(''),
        image: content.pages.home.about.logoImage,
        quote: content.pages.home.about.quoteText
      }} />
      <ImageGallery content={content.pages.home.gallery} />
      <FeedbackSection content={content.pages.home.testimonials} />
      <PartnersSection content={content.partners} />
      <NewsSection content={content.pages.home.newsHighlights} />
      <ContactSection content={content.pages.home.contactForm} />
      <Footer />
      <BackToTop />
    </main>
  )
}
