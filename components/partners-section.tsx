'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Partner {
  id: number
  name: string
  logo: string
}

export function PartnersSection({ content }: Readonly<{ content: Partner[] }>) {
  const [isPaused, setIsPaused] = useState(false)
  
  const partners = content && content.length > 0 ? content : []
  
  if (partners.length === 0) {
    return null // Không hiển thị gì nếu không có partners
  }

  return (
    <section className="py-16 md:py-24 bg-[#F5F5DC]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-[#2C5F2D] mb-4">
            Đối tác của chúng tôi
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Chúng tôi rất vinh dự được đồng hành cùng các thương hiệu
          </p>
        </div>

        {/* Infinite Auto-Scroll Container */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-8"
            style={{
              animation: 'scroll 20s linear infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* First set of logos */}
            {partners.map((partner) => (
              <div
                key={`first-${partner.id}`}
                className="flex-shrink-0 w-[280px] md:w-[320px] h-[180px] md:h-[200px] bg-[#2C5F2D] rounded-lg shadow-lg flex items-center justify-center p-8"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={250}
                  height={150}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner) => (
              <div
                key={`second-${partner.id}`}
                className="flex-shrink-0 w-[280px] md:w-[320px] h-[180px] md:h-[200px] bg-[#2C5F2D] rounded-lg shadow-lg flex items-center justify-center p-8"
              >
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={250}
                  height={150}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
