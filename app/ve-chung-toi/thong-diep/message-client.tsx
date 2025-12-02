"use client"

import Image from "next/image"
import { Dancing_Script } from "next/font/google"
import { AboutPageMessage } from "@/lib/types"

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
})

interface MessageClientProps {
  messageData: AboutPageMessage
}

export function MessageClient({ messageData }: MessageClientProps) {
  return (
    <section className="relative py-16 px-4 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={messageData.backgroundImage || "/images/ffd8709f-9ab7-4349-bed4-dc184fdce017.png"}
          alt="Farm landscape background"
          fill
          className="object-cover blur-md"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-white/95 shadow-2xl rounded-lg p-8 md:p-12 border-t-4 border-[#2d5016]">
          <div className="text-center mb-8">
            <div className="inline-block">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-3">{messageData.title}</h1>
              <div className="h-1 bg-[#2d5016] mb-4"></div>
              <h2 className="text-xl md:text-2xl font-semibold text-[#2d5016] mb-2">{messageData.subtitle}</h2>
            </div>
          </div>

          {messageData.greeting && (
            <div className="mb-6">
              <p className="text-gray-700 italic">{messageData.greeting}</p>
            </div>
          )}

          <div className="space-y-6 text-gray-800 leading-relaxed text-justify">
            {messageData.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}

            {messageData.quote && (
              <p className={`my-8 text-2xl md:text-3xl text-[#2d5016] font-bold text-center leading-relaxed ${dancingScript.className}`}>
                "{messageData.quote}"
              </p>
            )}
          </div>

          {messageData.signature && (
            <div className="mt-12 text-right space-y-2">
              <p className="text-gray-700">Trân trọng,</p>
              <p className={`text-3xl text-[#2d5016] font-bold ${dancingScript.className}`}>{messageData.signature}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
