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
export interface ContentBlock {
  id: string
  type: 'text' | 'image'
  content?: string // For text blocks
  imageUrl?: string // For image blocks
  imageCaption?: string // Caption/description for images
  imageAlt?: string // Alt text for accessibility
}

export interface NewsArticle {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  category: string
  featured: boolean
  content?: string // Legacy - kept for backward compatibility
  contentBlocks?: ContentBlock[] // New flexible content structure
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

export interface ContactPageContent {
  hero: {
    title: string
    subtitle: string
  }
  contactCards: {
    icon: string
    title: string
    description: string
    value: string
  }[]
  mapEmbedUrl: string
}

export interface Partner {
  id: number
  name: string
  logo: string
}

export interface PartnerBenefit {
  id: number
  icon: string
  title: string
  description: string
}

// About Page Types (Về Chúng Tôi)
export interface AboutPagePartners {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  intro: {
    title: string
    subtitle: string
  }
  benefits: PartnerBenefit[]
  cta: {
    title: string
    subtitle: string
    buttonText: string
  }
}

export interface AboutPageMission {
  hero: {
    image: string
    title?: string
    subtitle?: string
  }
  backgroundImage?: string
  companyName: string
  vision: string
  mission: {
    description: string
    points: string[]
  }
  coreValues: string[]
}

export interface AboutPageMessage {
  hero: {
    image: string
    title?: string
    subtitle?: string
  }
  backgroundImage?: string
  title: string
  subtitle: string
  greeting: string
  paragraphs: string[]
  quote: string
  signature: string
}

// Product List Page Types
export interface ProductCategory {
  id: string
  name: string
  icon: string
}

export interface ProductListItem {
  id: number
  name: string
  category: string
  weight: string
  description: string
  icon: string
}

export interface ProductsPageContent {
  hero: {
    title: string
    subtitle: string
  }
  categories: ProductCategory[]
  productList: ProductListItem[]
}

// Page Content Types
export interface PageContent {
  hero: HeroSection
  sections: Section[]
  contactInfo: ContactInfo
}

// Favicon Types
export interface FaviconConfig {
  lightIcon: string
  darkIcon: string
  svgIcon: string
  appleIcon: string
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
    contact: ContactPageContent
    products: ProductsPageContent
    aboutPartners: AboutPagePartners
    aboutMission: AboutPageMission
    aboutMessage: AboutPageMessage
  }
  partners: Partner[]
  products: Product[]
  news: NewsArticle[]
  faqs: Record<string, FAQ[]>
  favicon?: FaviconConfig
}
