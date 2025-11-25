import Image from 'next/image'
import Link from 'next/link'
import { Facebook } from 'lucide-react'

export function Footer() {
  return (
    <>
      {/* Bright green divider */}
      <div className="h-2 bg-[#7ed321]" />
      
      <footer className="bg-[#c9c7a8] text-gray-800">
        {/* Main footer content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Sản phẩm */}
            <div>
              <h3 className="font-bold text-lg mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Thức ăn cho heo 30-75kg
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Thức ăn cho heo 75 - xuất chuồng
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Thức ăn cho gà
                  </Link>
                </li>
              </ul>
            </div>

            {/* Làm việc tại Camico */}
            <div>
              <h3 className="font-bold text-lg mb-4">Làm việc tại Camico</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Cơ hội nghề nghiệp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Văn hóa doanh nghiệp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Học tập và phát triển
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sứ mệnh */}
            <div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Sứ mệnh và tâm nhìn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                    Camico cảm ơn
                  </Link>
                </li>
              </ul>
            </div>

            {/* Liên hệ & Social */}
            <div>
              <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
              <div className="mb-4">
                <h4 className="font-bold text-base mb-3">MẠNG XÃ HỘI</h4>
                <div className="flex gap-3">
                  <Link 
                    href="#" 
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-[#2d5a3a]" />
                  </Link>
                  <Link 
                    href="#" 
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5 text-[#2d5a3a]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-600 mb-8" />

          {/* Bottom footer */}
          <div className="grid md:grid-cols-3 gap-6 items-center text-sm">
            {/* Logo */}
            <div className="flex justify-center md:justify-start">
              <Image 
                src="/images/logo.png"
                alt="CAMICO"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Address */}
            <div className="text-center">
              <p>CT5D, Mễ Trì Hạ, Nam Từ Liêm, Hà Nội, Vietnam</p>
            </div>

            {/* Contact & Policy */}
            <div className="text-center md:text-right space-y-1">
              <p>
                <Link href="mailto:camicofarmer@gmail.com" className="hover:text-[#2d5a3a] transition-colors">
                  camicofarmer@gmail.com
                </Link>
              </p>
              <p>Hotline: 0981207115</p>
              <p>
                <Link href="#" className="hover:text-[#2d5a3a] transition-colors">
                  Chính sách bảo đảm
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
