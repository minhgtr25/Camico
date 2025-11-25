import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function SuMenhPage() {
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
            <div className="text-center mb-12">
              <div className="inline-block">
                <h1 className="text-3xl md:text-4xl font-bold text-[#2d5016] mb-3">
                  Tầm nhìn - Sứ mệnh - Giá trị cốt lõi
                </h1>
                <div className="h-1 bg-[#2d5016]"></div>
              </div>
            </div>

            {/* Danh xưng */}
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-[#2d5016] mb-4">Danh xưng</h2>
              <p className="text-lg text-gray-700 font-semibold">CÔNG TY CỔ PHẦN CAMICO</p>
            </div>

            {/* Tầm nhìn */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#2d5016] mb-4 text-center">Tầm nhìn</h2>
              <p className="text-gray-800 leading-relaxed text-center">
                Trở thành thương hiệu dẫn đầu Việt Nam trong lĩnh vực thức ăn chăn nuôi sinh học, hướng tới xuất khẩu ra
                khu vực ASEAN vào năm 2035. CAMICO định hướng trở thành biểu tượng của nông nghiệp xanh, nơi hội tụ khoa
                học, thiên nhiên và con người, góp phần xây dựng hệ sinh thái chăn nuôi bền vững và tự chủ cho Việt Nam.
              </p>
            </div>

            {/* Sứ mệnh */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#2d5016] mb-4 text-center">Sứ mệnh</h2>
              <p className="text-gray-800 leading-relaxed text-center">
                Mang đến giải pháp dinh dưỡng xanh – an toàn – hiệu quả
              </p>
              <p className="text-gray-800 leading-relaxed text-center mt-2">
                Vì sức khỏe vật nuôi và Sức khỏe người tiêu dùng
              </p>
              <p className="text-gray-800 leading-relaxed text-center mt-4">
                CAMICO không chỉ nuôi dưỡng vật nuôi, mà còn nuôi dưỡng hy vọng và tương lai cho người nông dân Việt
                Nam.
              </p>
            </div>

            {/* Giá trị cốt lõi */}
            <div>
              <h2 className="text-2xl font-bold text-[#2d5016] mb-6 text-center">Giá trị cốt lõi</h2>
              <div className="space-y-3 text-gray-800">
                <p className="text-center">Trung thực & Trách nhiệm</p>
                <p className="text-center">Đổi mới & Sáng tạo</p>
                <p className="text-center">Dũng hành & Chia sẻ</p>
                <p className="text-center">Bền vững & Nhân văn</p>
                <p className="text-center">Chất lượng & Niềm tin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
