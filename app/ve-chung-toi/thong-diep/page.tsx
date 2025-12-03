import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { fetchAdminContentFromServer } from "@/lib/admin-content"
import { MessageClient } from "./message-client"

export const dynamic = 'force-dynamic'

export default async function ThongDiepPage() {
  const adminContent = await fetchAdminContentFromServer()
  const messageData = adminContent?.pages?.aboutMessage || {
    hero: { image: "/images/anh-hero.png" },
    title: "THƯ NGỞ",
    subtitle: "Thông điệp nhà sáng lập",
    greeting: "Kính gửi: Quý khách hàng, đối tác và bạn bè,",
    paragraphs: [
      "Từ biến xanh, chúng tôi nhìn thấy tương lai của nông nghiệp Việt.",
      "Camico ra đời với một niềm tin giản dị: mọi thứ tương chúng bộ đi đều có thể trở nên tốt đẹp hơn...",
      "Chúng tôi không chỉ cần xuất cảm, mà còn tái sinh niềm tin của người nông dân...",
      "Hành trình của Camico không chỉ là hành trình kinh doanh, mà là hành trình của những người tin rằng nông nghiệp Việt có thể phát triển xanh...",
      "Chúng tôi đồng hành cùng người nông dân Việt trên hành trình nuôi dưỡng nguồn thực phẩm sạch..."
    ],
    quote: "Biến phụ phẩm thành giá trị, biến niềm tin thành hành động – đó là Camico.",
    signature: "CAMICO"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src={messageData.hero.image}
          alt="CAMICO - Thức ăn xanh chăn nuôi bền vững"
          fill
          className="object-cover"
          priority
        />
      </section>

      <MessageClient messageData={messageData} />

      <Footer />
    </div>
  )
}
