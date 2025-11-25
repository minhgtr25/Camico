// Landing Page Types
export interface HeroSection {
  title: string
  subtitle: string
  image: string
  buttonText?: string
  buttonLink?: string
}

export interface Section {
  id: string
  title: string
  description: string
  image?: string
  content?: string
}

export interface AboutSection {
  title: string
  emoji: string
  content: string[]
  quoteText: string
  quoteAuthor?: string
  logoImage: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  image: string
  rating: number
  feedback: string
}

export interface GalleryImage {
  id: string
  title: string
  image: string
  description: string
  fullDescription?: string
}

// Product Types
export interface Product {
  id: string
  name: string
  title: string
  tagline: string
  benefits: Array<{ id: string; text: string }>
  description: string
  image: string
  specifications?: Array<{ id: string; key: string; value: string }>
  faqs?: FAQ[]
}

export interface FAQ {
  id: number
  question: string
  answer: string
  author?: string | null
  title?: string | null
}

// News Types
export interface NewsArticle {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  category: string
  featured: boolean
  content?: string
  layout?: 'standard' | 'large-image' | 'split'
  author?: string | null
}

// Contact Page Types
export interface ContactInfo {
  phone: string
  email: string
  address: string
  country: string
}

export interface ContactForm {
  logo: string
  title: string
  subtitle: string
  buttonText: string
}

export interface Partner {
  id: number
  name: string
  logo: string
}

// Page Content Types
export interface PageContent {
  hero: HeroSection
  sections: Section[]
  contactInfo: ContactInfo
}

// Admin Content Types
export interface AdminContent {
  pages: {
    home: {
      hero: HeroSection
      about: AboutSection
      testimonials: Testimonial[]
      gallery: GalleryImage[]
      newsHighlights: NewsArticle[]
      contactInfo: ContactInfo
      contactForm: ContactForm
    }
    about: PageContent
    contact: PageContent
  }
  partners: Partner[]
  products: Product[]
  news: NewsArticle[]
  faqs: Record<string, FAQ[]>
}
