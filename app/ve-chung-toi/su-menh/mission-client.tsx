"use client"

import Image from "next/image"
import { AboutPageMission } from "@/lib/types"

interface MissionClientProps {
  missionData: AboutPageMission
}

export function MissionClient({ missionData }: MissionClientProps) {
  return (
    <section className="relative py-16 px-4 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ffd8709f-9ab7-4349-bed4-dc184fdce017.png"
          alt="Farm landscape background"
          fill
          className="object-cover blur-md"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-white/95 shadow-2xl rounded-lg p-8 md:p-12 border-t-4 border-[#2d5016]">
          <div className="text-center mb-12">
            <div className="inline-block">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-3">
                Tầm nhìn - Sứ mệnh - Giá trị cốt lõi
              </h1>
              <div className="h-1 bg-[#2d5016]"></div>
            </div>
          </div>

          {missionData.companyName && (
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-[#2d5016] mb-4">Danh xưng</h2>
              <p className="text-lg text-gray-700 font-semibold">{missionData.companyName}</p>
            </div>
          )}

          {missionData.vision && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#2d5016] mb-4 text-center">Tầm nhìn</h2>
              <p className="text-gray-800 leading-relaxed text-center">{missionData.vision}</p>
            </div>
          )}

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#2d5016] mb-4 text-center">Sứ mệnh</h2>
            {missionData.mission.description && (
              <p className="text-gray-800 leading-relaxed text-center">{missionData.mission.description}</p>
            )}
            {missionData.mission.points.map((point, i) => (
              <p key={i} className="text-gray-800 leading-relaxed text-center mt-2">{point}</p>
            ))}
          </div>

          {missionData.coreValues.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#2d5016] mb-6 text-center">Giá trị cốt lõi</h2>
              <div className="space-y-3 text-gray-800">
                {missionData.coreValues.map((value, i) => (
                  <p key={i} className="text-center">{value}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
