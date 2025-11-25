"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"
import { ContactPageContent } from "@/lib/types"

interface ContactPageClientProps {
  contactPage: ContactPageContent
}

export function ContactPageClient({ contactPage }: ContactPageClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 5000)
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Phone":
        return <Phone className="w-7 h-7" />
      case "Mail":
        return <Mail className="w-7 h-7" />
      case "MapPin":
        return <MapPin className="w-7 h-7" />
      default:
        return <Mail className="w-7 h-7" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-0 md:py-1">
      {/* Contact Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactPage.contactCards.map((card, index) => (
          <div 
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d5016]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2d5016] to-[#3d6826] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {getIcon(card.icon)}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{card.description}</p>
              <p className="text-[#2d5016] font-semibold text-lg">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Contact Form - Full Width */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Send className="w-8 h-8 text-[#2d5016]" />
            Gửi Tin Nhắn
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 animate-in slide-in-from-top">
              ✓ Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 px-4 py-3 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 px-4 py-3 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0123 456 789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 px-4 py-3 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ đề
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Chủ đề liên hệ"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 px-4 py-3 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Tin nhắn
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Nhập tin nhắn của bạn tại đây..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full border-2 border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 px-4 py-3 transition-colors resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#2d5016] to-[#3d6826] hover:shadow-lg text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Send className="w-5 h-5 mr-2" />
              Gửi Tin Nhắn
            </Button>
          </form>
        </div>

        {/* Sidebar Info - Below Form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-[#2d5016]/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2d5016]/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Phản hồi nhanh</p>
              <p className="text-sm text-gray-600">Chúng tôi sẽ liên hệ lại trong vòng 24 giờ làm việc</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {contactPage.mapEmbedUrl && (
        <div className="mt-12 bg-white rounded-3xl overflow-hidden shadow-lg">
          <iframe
            title="Google Maps - Văn phòng CAMICO"
            src={contactPage.mapEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  )
}
