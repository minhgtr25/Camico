import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { fetchAdminContentFromServer } from "@/lib/admin-content"
import { MissionClient } from "./mission-client"

export const dynamic = 'force-dynamic'

export default async function SuMenhPage() {
  const adminContent = await fetchAdminContentFromServer()
  let missionData = adminContent?.pages?.aboutMission || {
    hero: { image: "/images/anh-hero.png" },
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

  // Migration: Convert old object formats to new formats
  // 1. Convert vision object to string
  if (missionData.vision && typeof missionData.vision === 'object' && 'content' in missionData.vision) {
    missionData = {
      ...missionData,
      vision: (missionData.vision as any).content || "Trở thành thương hiệu dẫn đầu Việt Nam..."
    }
  }

  // 2. Convert mission object format
  if (missionData.mission && typeof missionData.mission === 'object') {
    const oldMission = missionData.mission as any
    if ('content' in oldMission && Array.isArray(oldMission.content)) {
      // Old format: mission has content array
      missionData = {
        ...missionData,
        mission: {
          description: oldMission.content[0] || "Mang đến giải pháp dinh dưỡng xanh – an toàn – hiệu quả",
          points: oldMission.content.slice(1) || []
        }
      }
    }
  }

  // 3. Convert coreValues object to array
  if (missionData.coreValues && typeof missionData.coreValues === 'object' && !Array.isArray(missionData.coreValues)) {
    const oldValues = missionData.coreValues as any
    missionData = {
      ...missionData,
      coreValues: oldValues.values || [
        "Trung thực & Trách nhiệm",
        "Đổi mới & Sáng tạo",
        "Dũng cảm & Chia sẻ",
        "Bền vững & Nhân văn",
        "Chất lượng & Niềm tin"
      ]
    }
  }

  // 4. Convert hero.backgroundImage to hero.image
  if (missionData.hero && 'backgroundImage' in missionData.hero && !('image' in missionData.hero)) {
    missionData = {
      ...missionData,
      hero: {
        image: (missionData.hero as any).backgroundImage || "/images/566248596-122105651259050657-7322533910289484122-n.jpg"
      }
    }
  }

  // Ensure all required fields are arrays/strings
  if (!missionData.coreValues || !Array.isArray(missionData.coreValues)) {
    missionData.coreValues = [
      "Trung thực & Trách nhiệm",
      "Đổi mới & Sáng tạo",
      "Dũng cảm & Chia sẻ",
      "Bền vững & Nhân văn",
      "Chất lượng & Niềm tin"
    ]
  }

  if (!missionData.mission?.points || !Array.isArray(missionData.mission.points)) {
    missionData = {
      ...missionData,
      mission: {
        description: missionData.mission?.description || "Mang đến giải pháp dinh dưỡng xanh – an toàn – hiệu quả",
        points: [
          "Vì sức khỏe vật nuôi và Sức khỏe người tiêu dùng",
          "CAMICO không chỉ nuôi dưỡng vật nuôi, mà còn nuôi dưỡng hy vọng và tương lai cho người nông dân Việt Nam."
        ]
      }
    }
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
