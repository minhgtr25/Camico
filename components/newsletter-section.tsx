'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <section className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text */}
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold">
                Thông tin khuyến mãi
              </h3>
              <p className="text-primary-foreground/90 leading-relaxed">
                Đăng ký ngay để không bỏ lỡ các thông tin và hập dẫn của CAMICO mỗi tháng qua email
              </p>
            </div>

            {/* Right Column - Form */}
            <div>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-primary-foreground text-foreground border-0 flex-1"
                />
                <Button 
                  type="submit"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 whitespace-nowrap"
                >
                  Đăng ký
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
