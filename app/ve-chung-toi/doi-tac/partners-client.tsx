"use client"

import { useState } from "react"
import Image from "next/image"
import { AboutPagePartners, Partner } from "@/lib/types"

interface PartnersClientProps {
  partnersData: AboutPagePartners
  partnerLogos: Partner[]
}

export function PartnersClient({ partnersData, partnerLogos }: Readonly<PartnersClientProps>) {
  const [isPaused, setIsPaused] = useState(false)

  // Use partner logos from admin content
  const partners = partnerLogos

  return (
    <section className="py-16 px-4 bg-[#F5F5DC]">
      <div className="container mx-auto max-w-6xl">
        {/* Intro */}
        <div className="mb-4 relative py-8 px-8 rounded-lg overflow-hidden">
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-4">{partnersData.intro.title}</h2>
            <p className="text-lg text-[#2d5016] text-center">{partnersData.intro.description}</p>
          </div>
        </div>

        {/* Partners Carousel */}
        <div className="relative overflow-hidden mb-12">
          <div
            className="flex gap-8"
            style={{
              animation: "scroll 20s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {partners.map((partner) => (
              <div
                key={`first-${partner.id}`}
                className="flex-shrink-0 w-[280px] md:w-[320px] h-[180px] md:h-[200px] bg-white rounded-lg shadow-lg flex items-center justify-center p-8"
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
            {partners.map((partner) => (
              <div
                key={`second-${partner.id}`}
                className="flex-shrink-0 w-[280px] md:w-[320px] h-[180px] md:h-[200px] bg-white rounded-lg shadow-lg flex items-center justify-center p-8"
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

        {/* Benefits */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-[#2d5016] text-center mb-12">Quyền lợi khi hợp tác với CAMICO</h2>
          <div className="space-y-4">
            {partnersData.benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[#2d5016] text-white rounded-lg p-6 flex gap-4 hover:shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="text-3xl flex-shrink-0 w-10 flex items-center">{benefit.icon}</div>
                <div>
                  <h3 className="font-bold mb-2">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-bold text-[#2d5016] mb-4">{partnersData.cta.title}</h3>
          <p className="text-gray-700 mb-6">{partnersData.cta.description}</p>
          <button className="bg-[#2d5016] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1f3810] transition-colors">
            {partnersData.cta.buttonText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
