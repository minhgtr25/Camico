'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Testimonial {
  id: number
  name: string
  role: string
  image: string
  rating: number
  feedback: string
}

export function FeedbackSection({ content }: Readonly<{ content: Testimonial[] }>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const testimonialsPerPage = 2
  
  const testimonials = content && content.length > 0 ? content : []

  const maxIndex = Math.ceil(testimonials.length / testimonialsPerPage) - 1

  const nextSlide = () => {
    setSlideDirection('right')
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setSlideDirection('left')
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 10000)

    return () => clearInterval(timer)
  }, [currentIndex, maxIndex])

  const currentTestimonials = testimonials.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage
  )
  
  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-[#F5F5DC]">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-[#2d5016] mb-6">
            Feedback
          </h2>
          <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto leading-relaxed">
            <span className="font-bold text-[#2d5016]">Khách hàng</span> và{' '}
            <span className="font-bold text-[#2d5016]">Đối tác</span> nói thay cho
            chúng tôi những trải nghiệm thật, giá trị thật.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full w-12 h-12 shadow-lg hidden md:flex"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-[#2d5016]" />
          </Button>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full w-12 h-12 shadow-lg hidden md:flex"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-[#2d5016]" />
          </Button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div
              key={currentIndex}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0 animate-in ${
                slideDirection === 'right'
                  ? 'slide-in-from-right'
                  : 'slide-in-from-left'
              } duration-500`}
            >
              {currentTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="flex flex-col sm:flex-row gap-6 p-6 flex-1">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full sm:w-40 h-48 sm:h-52 rounded-2xl overflow-hidden">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col min-h-0">
                      {/* Stars */}
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>

                      {/* Feedback */}
                      <p className="text-gray-700 text-sm leading-relaxed text-justify mb-4 flex-1 overflow-auto">
                        {testimonial.feedback}
                      </p>

                      {/* Name & Role */}
                      <div className="mt-auto pt-2 border-t border-gray-100">
                        <p className="font-bold text-[#2d5016] text-base mt-2">
                          {testimonial.name}
                        </p>
                        <p className="text-gray-600 text-sm break-words">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setSlideDirection(index > currentIndex ? 'right' : 'left')
                  setCurrentIndex(index)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#2d5016] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial set ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
