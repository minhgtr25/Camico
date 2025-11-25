'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GallerySlide {
  id: number | string
  title: string
  image: string
  description: string
  fullDescription?: string
}

export function ImageGallery({ content }: Readonly<{ content: GallerySlide[] }>) {
  const defaultSlides: GallerySlide[] = [
    {
      id: 1,
      title: 'Giảm thiểu rác thải',
      image: '/sustainable-farming-waste-reduction.jpg',
      description: 'Cam kết bảo vệ môi trường và phát triển bền vững',
      fullDescription: 'CAMICO cam kết giảm thiểu rác thải trong quá trình sản xuất, tái chế và tận dụng phụ phẩm nông nghiệp để tạo ra thức ăn chăn nuôi sinh học chất lượng cao, góp phần bảo vệ môi trường và phát triển nông nghiệp bền vững cho cộng đồng.',
    },
    {
      id: 2,
      title: 'Sản phẩm xanh',
      image: '/organic-green-livestock-feed-products.jpg',
      description: 'Thức ăn chăn nuôi sinh học chất lượng cao',
      fullDescription: 'Sản phẩm của CAMICO được sản xuất từ nguyên liệu hữu cơ, không sử dụng hóa chất độc hại, đảm bảo an toàn tuyệt đối cho vật nuôi. Thức ăn giàu dinh dưỡng giúp gia súc phát triển khỏe mạnh và cho năng suất cao.',
    },
    {
      id: 3,
      title: 'Chăn nuôi bền vững',
      image: '/sustainable-livestock-farming-practices.jpg',
      description: 'Phương pháp chăn nuôi thân thiện với môi trường',
      fullDescription: 'Chúng tôi hỗ trợ nông dân áp dụng phương pháp chăn nuôi bền vững, giảm thiểu tác động tiêu cực đến môi trường. Sản phẩm của CAMICO giúp cải thiện sức khỏe đàn vật nuôi, tăng năng suất và lợi nhuận cho người chăn nuôi.',
    },
    {
      id: 4,
      title: 'Nguồn gốc tự nhiên',
      image: '/natural-organic-ingredients-farming.jpg',
      description: 'Nguyên liệu tự nhiên từ thiên nhiên',
      fullDescription: 'Tất cả nguyên liệu được lựa chọn kỹ lưỡng từ các trang trại hữu cơ có nguồn gốc rõ ràng. CAMICO tin tưởng vào sức mạnh của thiên nhiên, mang đến những sản phẩm thức ăn chăn nuôi tinh khiết và an toàn nhất.',
    },
  ]
  
  const slides = content && content.length > 0 ? content : defaultSlides
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [expandedSlides, setExpandedSlides] = useState<Record<string | number, boolean>>({})

  const hasExpandedSlide = Object.values(expandedSlides).includes(true)

  useEffect(() => {
    if (!isAutoPlaying || hasExpandedSlide) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, hasExpandedSlide, slides.length])

  useEffect(() => {
    setExpandedSlides(prev => {
      const updated = { ...prev }
      const activeId = slides?.[currentIndex]?.id
      for (const s of slides) {
        if (s.id !== activeId) updated[s.id] = false
      }
      return updated
    })
  }, [currentIndex, slides])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const toggleExpand = (slideId: number) => {
    setExpandedSlides(prev => {
      const newValue = !prev[slideId]
      if (!newValue) {
        setIsAutoPlaying(true)
      }
      return {
        ...prev,
        [slideId]: newValue
      }
    })
  }

  const getSlidePosition = (index: number) => {
    const diff = index - currentIndex
    if (diff === 0) return 'translate-x-0 scale-100 z-30 opacity-100'
    if (diff === 1 || diff === -(slides.length - 1))
      return 'translate-x-[60%] scale-90 z-20 opacity-60'
    if (diff === -1 || diff === slides.length - 1)
      return 'translate-x-[-60%] scale-90 z-20 opacity-60'
    if (diff > 1 || diff < -1) return 'translate-x-[120%] scale-75 z-10 opacity-0'
    return 'translate-x-0 scale-100 z-30'
  }
  
  if (slides.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-[#F5F5DC] relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Gallery Container */}
        <div className="relative h-[500px] flex items-center justify-center">
          {/* Slides */}
          <div className="relative w-full max-w-4xl h-full">
            {slides.map((slide, index) => {
              const isExpanded = expandedSlides[slide.id]
              const isActive = index === currentIndex
              
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${getSlidePosition(index)}`}
                  style={{
                    transformOrigin: 'center',
                  }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-700">
                    {/* Image */}
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${
                      isExpanded && isActive
                        ? 'from-black/90 via-black/70 to-black/50'
                        : 'from-black/70 via-black/30 to-transparent'
                    }`} />
                    
                    {/* Content */}
                    <div className={`absolute bottom-0 left-0 right-0 p-8 text-white transition-all duration-500 ${
                      isExpanded && isActive ? 'translate-y-[-80px]' : 'translate-y-0'
                    }`}>
                      <h2 className="text-4xl font-black mb-4">{slide.title}</h2>
                      
                      {isExpanded && isActive ? (
                        <p className="text-base mb-6 text-gray-100 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
                          {slide.fullDescription}
                        </p>
                      ) : (
                        <p className="text-lg mb-6 text-gray-200">{slide.description}</p>
                      )}
                      
                      <Button
                        onClick={() => toggleExpand(slide.id)}
                        variant="outline"
                        className="bg-black text-white border-white hover:bg-white hover:text-black transition-colors"
                      >
                        {isExpanded && isActive ? 'Thu hẹp' : 'Chi tiết'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="hidden md:flex absolute left-4 z-40 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg items-center justify-center transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-4 z-40 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg items-center justify-center transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoPlaying(false)
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#2D5F3F] w-8'
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
