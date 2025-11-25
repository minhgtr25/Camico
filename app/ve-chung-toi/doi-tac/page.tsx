"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import Image from "next/image"

export default function DoiTacPage() {
  const [isPaused, setIsPaused] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const partners = [
    { id: 1, name: "Partner 1", logo: "/images/logo-green.png" },
    { id: 2, name: "Partner 2", logo: "/images/logo-green.png" },
    { id: 3, name: "Partner 3", logo: "/images/logo-green.png" },
    { id: 4, name: "Partner 4", logo: "/images/logo-green.png" },
    { id: 5, name: "Partner 5", logo: "/images/logo-green.png" },
  ]

  const benefits = [
    {
      icon: "🌿",
      title: "Nâng cao uy tín và hình ảnh thương hiệu xanh",
      description:
        "Camico giúp đối tác ghi dấu gia tăng thương hiệu thông qua động hành trong chuyên truyền thông xanh vững.",
    },
    {
      icon: "🌍",
      title: "Mở rộng mạng lưới kinh doanh co hội thị trường",
      description:
        "Tiếp cận cơ hội kinh doanh rộng lớn, thị trường mới và khách hàng mới trong lĩnh vực nông nghiệp sinh học.",
    },
    {
      icon: "🔬",
      title: "Tiếp cận công nghệ sinh học và giải pháp xuất tiên tiến",
      description:
        "Được tiếp cận công nghệ tiên tiến, giải pháp thông minh, chuỗi hỗ trợ từ nghiên cứu đến triển khai thị trường.",
    },
    {
      icon: "🤝",
      title: "Hợp tác minh bạch – phát triển bền vững cùng nhau",
      description:
        "Các nhóa tham gia hợp tác được xây dựng trên cơ sở lợi ích chung, hướng tới phát triển lâu dài cho cả hai bên.",
    },
    {
      icon: "📢",
      title: "Đóng góp truyền thông và quảng bá thương hiệu",
      description:
        "Phối hợp trong các hoạt động truyền thông, hội thảo hiệu quả, quảng bá sản phẩm và hình ảnh công nghiệp.",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % partners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + partners.length) % partners.length)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/images/ffd8709f-9ab7-4349-bed4-dc184fdce017.png')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Đối tác chiến lược</h1>
          <p className="text-white text-lg">Cùng phát triển tương lai bền vững</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 bg-[#F5F5DC]">
        <div className="container mx-auto max-w-6xl">
          {/* Partners Carousel Section */}
          <div className="mb-4 relative py-8 px-8 rounded-lg overflow-hidden">
            {/* Text content */}
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-4">Đối tác của chúng tôi</h2>
              <p className="text-lg text-[#2d5016] text-center">
                Chúng tôi rất vinh dự được đồng hành cùng các thương hiệu
              </p>
            </div>
          </div>

          {/* Infinite Auto-Scroll Container */}
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

          {/* Benefits Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-[#2d5016] text-center mb-12">Quyền lợi khi hợp tác với CAMICO</h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
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

          {/* CTA Section */}
          <div className="text-center mt-16 bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-2xl font-bold text-[#2d5016] mb-4">Sẵn sàng hợp tác?</h3>
            <p className="text-gray-700 mb-6">Hãy liên hệ với CAMICO để cùng xây dựng tương lai bền vững</p>
            <button className="bg-[#2d5016] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1f3810] transition-colors">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </section>

      <Footer />

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
    </div>
  )
}
