import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { fetchAdminContentFromServer } from "@/lib/admin-content"
import { PartnersClient } from "./partners-client"

export const dynamic = 'force-dynamic'

export default async function DoiTacPage() {
  const adminContent = await fetchAdminContentFromServer()
  const partnersData = adminContent?.pages?.aboutPartners || {
    hero: {
      title: "Đối tác chiến lược",
      subtitle: "Cùng phát triển tương lai bền vững",
      backgroundImage: "/images/ffd8709f-9ab7-4349-bed4-dc184fdce017.png"
    },
    intro: {
      title: "Đối tác của chúng tôi",
      description: "Chúng tôi rất vinh dự được đồng hành cùng các thương hiệu"
    },
    benefits: [
      { icon: "🌿", title: "Nâng cao uy tín và hình ảnh thương hiệu xanh", description: "Camico giúp đối tác ghi dấu gia tăng thương hiệu..." },
      { icon: "🌍", title: "Mở rộng mạng lưới kinh doanh", description: "Tiếp cận cơ hội kinh doanh rộng lớn..." },
      { icon: "🔬", title: "Tiếp cận công nghệ sinh học", description: "Được tiếp cận công nghệ tiên tiến..." },
      { icon: "🤝", title: "Hợp tác minh bạch", description: "Các nhóa tham gia hợp tác được xây dựng..." },
      { icon: "📢", title: "Đóng góp truyền thông", description: "Phối hợp trong các hoạt động truyền thông..." },
    ],
    cta: {
      title: "Sẵn sàng hợp tác?",
      description: "Hãy liên hệ với CAMICO để cùng xây dựng tương lai bền vững",
      buttonText: "Liên hệ ngay"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url('${partnersData.hero.backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{partnersData.hero.title}</h1>
          <p className="text-white text-lg">{partnersData.hero.subtitle}</p>
        </div>
      </section>

      <PartnersClient partnersData={partnersData} />

      <Footer />
    </div>
  )
}

