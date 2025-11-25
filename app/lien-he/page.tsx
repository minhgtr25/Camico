import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchAdminContentFromServer } from "@/lib/admin-content"
import { ContactPageClient } from "./contact-client"

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const adminContent = await fetchAdminContentFromServer()
  const contactPage = adminContent?.pages?.contact || {
    hero: {
      title: "Liên Hệ Với Chúng Tôi",
      subtitle: "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với CAMICO ngay hôm nay.",
      image: ""
    },
    contactCards: [
      { icon: "Phone", title: "Điện thoại", description: "Gọi cho chúng tôi để được tư vấn trực tiếp", value: "(+84) 123 456 789" },
      { icon: "Mail", title: "Email", description: "Gửi email cho chúng tôi bất kỳ lúc nào", value: "info@camico.com.vn" },
      { icon: "MapPin", title: "Địa chỉ", description: "Số 123 Đường ABC, Quận 1, TP. Hồ Chí Minh", value: "Việt Nam" },
    ],
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4582.82993520069!2d105.78123107596934!3d21.014323688272853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abcc1f4d5cef%3A0xd0246a423eb425f3!2zQ1Q1RCBN4buFIFRyw6wgSOG6oQ!5e1!3m2!1svi!2s!4v1764005651967!5m2!1svi!2s"
  }

  return (
    <main className="min-h-screen bg-[#f5f5dc]">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#f5f5dc] py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2d5016] mb-4">
            {contactPage.hero.title}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {contactPage.hero.subtitle}
          </p>
        </div>
      </div>

      <ContactPageClient contactPage={contactPage} />
      
      <Footer />
    </main>
  )
}

