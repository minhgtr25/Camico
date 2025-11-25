import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Dancing_Script } from "next/font/google"

const dancingScript = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
})

export default function ThongDiepPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section with Illustrated Background */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="/images/566248596-122105651259050657-7322533910289484122-n.jpg"
          alt="CAMICO - Thức ăn xanh chăn nuôi bền vững"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Content Section with Background */}
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

        {/* Content */}
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Letter Card */}
          <div className="bg-white/95 shadow-2xl rounded-lg p-8 md:p-12 border-t-4 border-[#2d5016]">
            {/* Letter Header */}
            <div className="text-center mb-8">
              <div className="inline-block">
                <h1 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-3">THƯ NGỎ</h1>
                <div className="h-1 bg-[#2d5016] mb-4"></div>
                <h2 className="text-xl md:text-2xl font-semibold text-[#2d5016] mb-2">Thông điệp nhà sáng lập</h2>
              </div>
            </div>

            {/* Greeting */}
            <div className="mb-6">
              <p className="text-gray-700 italic">Kính gửi: Quý khách hàng, đối tác và bạn bè,</p>
            </div>

            {/* Letter Body */}
            <div className="space-y-6 text-gray-800 leading-relaxed text-justify">
              <p className="text-lg font-medium text-[#2d5016] italic">
                "Từ biến xanh, chúng tôi nhìn thấy tương lai của nông nghiệp Việt."
              </p>

              <p>
                Camico ra đời với một niềm tin giản dị: mọi thứ tương chúng bộ đi đều có thể trở nên tốt đẹp hơn – nếu
                chúng ta sẵn sàng thay đổi và chịu trách nhiệm với môi trường. Những vùn cá nhỏ bé bị lãng quên ngoại
                khơi, qua bàn tay con người và công nghệ sinh học, có thể trở thành hạt cám xanh – nuôi dưỡng vật nuôi,
                con người và cả tương lai bền vững của đất nước.
              </p>

              <p>
                Chúng tôi không chỉ cần xuất cảm, mà còn tái sinh niềm tin của người nông dân, tái thiết giá trị của phụ
                phẩm thủy sản và tái tạo mô hình kinh tế tuần hoàn cho Việt Nam.
              </p>

              <p>
                Hành trình của Camico không chỉ là hành trình kinh doanh, mà là hành trình của những người tin rằng nông
                nghiệp Việt có thể phát triển xanh – sạch – và có trách nhiệm.
              </p>

              <p
                className={`my-8 text-2xl md:text-3xl text-[#2d5016] font-bold text-center leading-relaxed ${dancingScript.className}`}
              >
                "Biến phụ phẩm thành giá trị, biến niềm tin thành hành động – đó là Camico."
              </p>

              <p>
                Chúng tôi đồng hành cùng người nông dân Việt trên hành trình nuôi dưỡng nguồn thực phẩm sạch, bảo vệ môi
                trường và hướng đến tương lai xanh.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-12 text-right space-y-2">
              <p className="text-gray-700">Trân trọng,</p>
              <p className={`text-3xl text-[#2d5016] font-bold ${dancingScript.className}`}>CAMICO</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
