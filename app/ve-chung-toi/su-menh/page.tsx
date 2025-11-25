import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { fetchAdminContentFromServer } from "@/lib/admin-content"
import { MissionClient } from "./mission-client"

export const dynamic = 'force-dynamic'

export default async function SuMenhPage() {
  const adminContent = await fetchAdminContentFromServer()
  const missionData = adminContent?.pages?.aboutMission || {
    hero: { image: "/images/566248596-122105651259050657-7322533910289484122-n.jpg" },
    companyName: "CÔNG TY CỔ PHẦN CAMICO",
    vision: "Trở thành thương hiệu dẫn đầu Việt Nam trong lĩnh vực thức ăn chăn nuôi sinh học...",
    mission: {
      description: "Mang đến giải pháp dinh dưỡng xanh – an toàn – hiệu quả",
      points: [
        "Vì sức khỏe vật nuôi và Sức khỏe người tiêu dùng",
        "CAMICO không chỉ nuôi dưỡng vật nuôi, mà còn nuôi dưỡng hy vọng và tương lai cho người nông dân Việt Nam."
      ]
    },
    coreValues: [
      "Trung thực & Trách nhiệm",
      "Đổi mới & Sáng tạo",
      "Dũng hành & Chia sẻ",
      "Bền vững & Nhân văn",
      "Chất lượng & Niềm tin"
    ]
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src={missionData.hero.image}
          alt="CAMICO - Thức ăn xanh chăn nuôi bền vững"
          fill
          className="object-cover"
          priority
        />
      </section>

      <MissionClient missionData={missionData} />

      <Footer />
    </div>
  )
}
