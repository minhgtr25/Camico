'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import Image from 'next/image'

interface ContactContent {
  logo: string
  title: string
  subtitle: string
  buttonText: string
}

export function ContactSection({ content }: Readonly<{ content: ContactContent }>) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    // Reset form
    setFormData({ name: '', phone: '', email: '', address: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  
  if (!content) {
    return null
  }

  return (
    <section className="bg-[#2d5a3a] text-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image 
              src={content.logo}
              alt="CAMICO Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {content.title}
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-white/95">
            {content.subtitle}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              required
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 h-14 rounded-full px-6 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white hover:border-white"
            />
            <Input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 h-14 rounded-full px-6 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white hover:border-white"
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 h-14 rounded-full px-6 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white hover:border-white"
            />
            <Input
              type="text"
              name="address"
              placeholder="Địa chỉ"
              value={formData.address}
              onChange={handleChange}
              required
              className="bg-transparent border-2 border-white text-white placeholder:text-white/70 h-14 rounded-full px-6 text-base focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white hover:border-white"
            />
            <Button 
              type="submit"
              className="bg-white text-[#2d5a3a] hover:bg-white/90 h-14 rounded-full px-12 text-base font-semibold w-full md:w-auto"
            >
              {content.buttonText}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
