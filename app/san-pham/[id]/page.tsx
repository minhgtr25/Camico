"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useState, useEffect, use } from "react"

// Product data with detailed information
const productsData: Record<
  string,
  {
    id: number
    name: string
    title: string
    tagline: string
    benefits: Array<{ id: string; text: string }>
    description: string
    image: string
  }
> = {
  "1": {
    id: 1,
    name: "Thức ăn cho heo thịt (30-75kg)",
    title: "THỨC ĂN CHO HEO THỊT (30-75KG)",
    tagline: "Ăn khoẻ - Lớn nhanh - Khoẻ mạnh mỗi ngày",
    benefits: [
      { id: "benefit-1-1", text: "Cung cấp năng lượng, dầu và khoáng chất glup heo tổng trong nhanh, sản chắc thịt." },
      { id: "benefit-1-2", text: "Bổ sung enzyme sinh học và chiết xuất thảo mộc từ nhiều glup tiêu hóa tốt, tăng sức đề kháng." },
      { id: "benefit-1-3", text: "Hỗ trợ phát triển khung xương - cơ bắp, giảm mỡ hut, bết kiểm chỉ phí chăn nuôi." },
      { id: "benefit-1-4", text: "Sản phẩm sinh học, nguồn dạm từ phụ phẩm có biên ghi giảm mùi thải, thúc thiến môi trường." },
    ],
    description:
      "Thức ăn cho heo giai đoạn 30-75kg giúp heo phát triển khung xương, cơ bắp và tăng trưởng nhanh, đông thời duy trì sức khoẻ ruột ổn định. Công thức định dưỡng của Camico được cân đối tối ưu giúp heo ăn ngon miệng, tăng nạc nhanh, giảm mỡ, mang lợi ích cao cho người chăn nuôi.",
    image: "/feed-bag-pig-heo.jpg",
  },
  "2": {
    id: 2,
    name: "Thức ăn cho heo thịt (75kg - xuất chuồng)",
    title: "THỨC ĂN CHO HEO THỊT (75KG- XUẤT CHUỒNG)",
    tagline: "Heo khoẻ mạnh - Lớn nhanh - Thịt sạch tự nhiên",
    benefits: [
      { id: "benefit-2-1", text: "Cung cấp dầu dù ở năng lượng, dầu và khoáng chất glup heo tổng trong nhanh, sản chắc thịt" },
      { id: "benefit-2-2", text: "Enzyme sinh học và chiết xuất thảo mộc từ nhiều hỗ trợ tiêu hóa, tăng sức đề kháng, tăng năng chất và hạn chế bệnh đường ruột" },
      { id: "benefit-2-3", text: "Giúp giảm hao hút, tiết kiếm chi phí, nâng cao hạn hạn, tiết kiếm chi phí, nâng cao hạn hạn – ơn toàn – hiệu quả" },
      { id: "benefit-2-4", text: "Sản phẩm sinh học, nguồn dạm từ phụ phẩm có biên ghi giảm mùi thải, hương dẹn chọn xanh – ơn toàn – hiệu quả" },
    ],
    description:
      "Thức ăn dành cho heo giai đoạn 75kg - xuất chuồng được thiết kế nhằm tối ưu uất trong cuối cùng, giúp heo đạt trong lượng mỡ muối trong thời gian ngắn nhất. Công thức giám đạm – cân đối nạc – yêu cầu năng lượng giúp heo ít ích thịt, sản chắc, da giá thành chân nuôi vừa.",
    image: "/feed-bag-pig.jpg",
  },
  "3": {
    id: 3,
    name: "Thức ăn cho gà thả vườn (46 ngày - xuất chuồng)",
    title: "THỨC ĂN CHO GÀ THẢ VƯỜN (46 NGÀY-XUẤT CHUỒNG)",
    tagline: "Gà khoẻ - Thịt ngon - Nuôi sạch bền vững",
    benefits: [
      { id: "benefit-3-1", text: "Giúp gà tươm trưởng tự nhiên, thịt ơn chắc, thơm ngon, ít mỡ" },
      { id: "benefit-3-2", text: "Tổng sức đề kháng, giảm bệnh đường ruột nhờ enzyme sinh học và chiết xuất thảo mộc từ nhiều" },
      { id: "benefit-3-3", text: "Giảm hao hút, tăng hiệu quả kinh tế, phù hợp canh nuôi sạch, hữu cơ thả vườn" },
      { id: "benefit-3-4", text: "Công thức tối ưu giúp heo ít ích thịt sản chắc, da giá thành chân nuôi vừa" },
    ],
    description:
      "Thức ăn cho gà thả vườn từ 46 ngày tuổi - xuất chuồng được bổ sung enzyme tiêu hóa và khoáng chất tự nhiên, giúp gà phát triển có thịt săn chắc, da vàng đẹp và mờ. Công thức tối ưu giúp gà ít ích thịt sản chắc, tăng suất đề kháng thịt vượt trội.",
    image: "/feed-bag-chicken.jpg",
  },
}

const faqDataByProduct: Record<
  string,
  Array<{ id: number; question: string; answer: string; author?: string | null; title?: string | null }>
> = {
  "1": [
    {
      id: 1,
      question: "Tác dụng phụ của sản phẩm là gì?",
      answer:
        "Sản phẩm CAMICO được sản xuất từ nguồn nguyên liệu tự nhiên, không chứa chất kích thích hoặc kháng sinh. Sản phẩm đã được kiểm định an toàn và không có tác dụng phụ khi sử dụng đúng theo hướng dẫn.",
      author: "Ông Hà Duy Hùng",
      title: "Chuyên Gia Dinh Dưỡng - Giám Độc Công Ty Ứng Dụng Công Nghệ Cao AZ",
    },
    {
      id: 2,
      question: "Trong quá trình ăn, có thể phối trộn sản phẩm với các loại thực phẩm khác được hay không?",
      answer:
        "Có thể phối trộn sản phẩm với các loại thực phẩm khác như cỏ, rau, hoặc các nguồn thức ăn bổ sung khác. Tuy nhiên, nên duy trì tỷ lệ sản phẩm CAMICO từ 70-80% để đảm bảo hiệu quả dinh dưỡng tối ưu.",
      author: null,
      title: null,
    },
    {
      id: 3,
      question: "Liều lượng sử dụng sản phẩm như thế nào để đạt hiệu quả tốt nhất?",
      answer:
        "Liều lượng tùy thuộc vào tuổi, trọng lượng, và loại vật nuôi. Thông thường, mỗi ngày nên cho ăn sản phẩm từ 2-5% trọng lượng cơ thể của vật nuôi, chia làm 2-3 bữa. Xem hướng dẫn trên bao để biết chi tiết chính xác.",
      author: null,
      title: null,
    },
    {
      id: 4,
      question: "Tìm hiểu thêm về khả năng hỗ trợ sức khỏe cho đàn vật nuôi",
      answer:
        "Các dòng TACN của Camico được bổ sung enzyme tiêu hóa, khoáng và lượng và các chất tăng cường miễn dịch nữa hút hút hơi hao hút trong nhanh rất lợi ích, hạn chế bệnh trong suất chu kỳ nuôi.",
      author: null,
      title: null,
    },
  ],
  "2": [
    {
      id: 1,
      question: "Tác dụng phụ của sản phẩm là gì?",
      answer:
        "Sản phẩm CAMICO được sản xuất từ nguồn nguyên liệu tự nhiên, không chứa chất kích thích hoặc kháng sinh. Sản phẩm đã được kiểm định an toàn và không có tác dụng phụ khi sử dụng đúng theo hướng dẫn.",
      author: null,
      title: null,
    },
    {
      id: 2,
      question: "Trong quá trình ăn, có thể phối trộn sản phẩm với các loại thực phẩm khác được hay không?",
      answer:
        "Có thể phối trộn sản phẩm với các loại thực phẩm khác. Để phát triển nạc tốt ở giai đoạn cuối, nên cho ăn hạn chế rau xanh nhưng tăng cấp ngũ cốc tốt. Chiết xuất thảo mộc trong sản phẩm giúp tiêu hóa tốt hơn.",
      author: null,
      title: null,
    },
    {
      id: 3,
      question: "Liều lượng sử dụng sản phẩm như thế nào để đạt hiệu quả tốt nhất?",
      answer:
        "Ở giai đoạn 75kg xuất chuồng, nên cho ăn full sản phẩm CAMICO (không trộn thức ăn khác) để đạt hiệu quả tốt nhất. Liều lượng khoảng 2-3% trọng lượng cơ thể mỗi ngày. Theo dõi tăng trưởng để điều chỉnh hợp lý.",
      author: null,
      title: null,
    },
    {
      id: 4,
      question: "Tìm hiểu thêm về khả năng hỗ trợ sức khỏe cho đàn vật nuôi",
      answer:
        "Sản phẩm được thiết kế đặc biệt với công thức giàu nạc, giảm mỡ. Enzyme tiêu hóa giúp hạn chế tiêu chảy, nấm trong giai đoạn cuối. Hiệu quả chuyển hóa cao giúp heo phát triển tối ưu.",
      author: null,
      title: null,
    },
  ],
  "3": [
    {
      id: 1,
      question: "Có cần bổ sung thêm ngô, cám gạo hoặc rau xanh khi cho gà ăn không?",
      answer:
        "Có thể bổ sung thêm ngô, cám gạo hoặc rau xanh khi cho gà ăn không? Đối với gà thả vườn, bạn có thể cho ăn thêm các loại thực phẩm khác như rau xanh, bắp, cám gạo để giúp gà ăn đa dạng. Tuy nhiên, sản phẩm CAMICO đã chứa đủ các chất dinh dưỡng cần thiết, vì vậy chỉ nên sử dụng như bổ sung thêm mà không thay thế hoàn toàn.",
      author: null,
      title: null,
    },
    {
      id: 2,
      question: "Làm sao để biết gà ăn đủ khẩu phần và đạt hiệu quả tốt nhất?",
      answer:
        "Quan sát mức liễu thụ thực ăn và tốc độ tăng trưởng. Nếu gà ăn hết khẩu phần mỗi ngày, lông mượt, vận động linh hoạt và làng cần ăn định thì đang hấp thu tốt. Camico khuyên nên thử 5-10 con mẫu mỗi tuần để điều chỉnh lượng ăn phù hợp.",
      author: null,
      title: null,
    },
    {
      id: 3,
      question: "Sản phẩm có giúp gà tăng sức đề kháng, hạn chế bệnh tật không?",
      answer:
        "Có thể bổ sung enzyme tiêu hóa, khoáng và vitamin từ nhiên giúp gà quên khẩu phân mỗi ngày. Camico đã cân đối để nâng cao sức đề kháng, nên việc cho ăn thêm chi nhằm giúp gà quan khẩu vị từ nhiên giúp gà quên khẩu phân mỗi ngày. Trên toàn quá nhiều khiến tiêu chảy.",
      author: "Ông Hà Duy Hùng",
      title: "Chuyên Gia Dinh Dưỡng - Giám Độc Công Ty Ứng Dụng Công Nghệ Cao AZ",
    },
    {
      id: 4,
      question: "Bảo quản thức ăn Camico như thế nào để không bị hỏng, mốc?",
      answer:
        "Nên để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp và ẩm ướt. Sau khi mở bao, buộc kín không đặt sắt nên đặt. Không nên để cửa lâu sau khi mở vì thực ăn hấp thụ ẩm có thể gây chất lượng và mùi vị.",
      author: null,
      title: null,
    },
  ],
}

export default function ProductDetailPage({ params }: { readonly params: Promise<{ readonly id: string }> }) {
  const { id } = use(params)
  // Initialize product state from built-in data, but prefer adminContent from localStorage if available
  const [product, setProduct] = useState(() => productsData[id])
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [productFAQ, setProductFAQ] = useState(faqDataByProduct[id] || [])

  useEffect(() => {
    try {
      const raw = globalThis?.localStorage?.getItem('adminContent')
      if (raw) {
        const admin = JSON.parse(raw)
        // Try to find product by id (admin products use string ids)
        const adminProduct = (admin.products || []).find((p: any) => p.id === id || String(p.id) === String(id))
        if (adminProduct) {
          // Map admin product structure to productData fields if necessary
          const mapped = {
            id: adminProduct.id,
            name: adminProduct.title || adminProduct.name || productsData[id]?.name,
            title: adminProduct.title || adminProduct.name || productsData[id]?.title,
            tagline: adminProduct.tagline || productsData[id]?.tagline,
            benefits: adminProduct.benefits || productsData[id]?.benefits || [],
            description: adminProduct.description || productsData[id]?.description,
            image: adminProduct.image || productsData[id]?.image,
          }
          setProduct(mapped)
        }

        // Try to read FAQs: prefer product-level faqs, then admin.faqs mapping
        if (admin.products) {
          const adminP = (admin.products || []).find((p: any) => p.id === id || String(p.id) === String(id))
          if (adminP?.faqs?.length) {
            setProductFAQ(adminP.faqs)
            return
          }
          }
          if (admin.faqs?.[id]?.length) {
            setProductFAQ(admin.faqs[id])
            return
          }
      }
    } catch (e) {
      console.warn('Failed to load adminContent from localStorage', e)
    }
  }, [id])

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5f5dc]">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">Sản phẩm không tìm thấy</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f5dc]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/san-pham" className="hover:text-primary transition-colors">
              Sản phẩm
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 rounded-lg w-full aspect-square flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <p className="text-[#2d5016] text-sm font-semibold mb-3">THỨC ĂN TỔNG HỢP</p>
            <h1 className="text-4xl font-bold text-gray-800 mb-8 leading-tight">{product.title}</h1>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-6">Công dụng sản phẩm</h3>
              <ul className="space-y-4">
                {product.benefits.map((benefit) => (
                  <li key={benefit.id} className="flex gap-3">
                    <span className="text-primary text-xl flex-shrink-0">●</span>
                    <span className="text-gray-700 text-sm leading-relaxed">{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Tagline Section */}
        <div className="bg-[#f5f5dc] py-12 px-0 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{product.tagline}</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#2d5016] text-sm font-semibold mb-3">TÌM HIỂU THÊM THÔNG TIN</p>
              <h2 className="text-3xl font-bold text-gray-800">NHỮNG CÂU HỎI THƯỜNG GẶP</h2>
            </div>

            <div className="space-y-3">
              {productFAQ.map((faq) => (
                <div key={faq.id} className="bg-[#d9a5a5] rounded-lg overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 text-left font-semibold text-gray-800 hover:bg-[#cf9898] transition-colors flex justify-between items-center"
                  >
                    <span>{faq.question}</span>
                    <span className="text-xl transition-transform duration-300">
                      {expandedFAQ === faq.id ? "−" : "+"}
                    </span>
                  </button>

                  {expandedFAQ === faq.id && (
                    <div className="px-6 py-4 bg-[#f5e8e1] text-gray-700 border-t border-[#cf9898] animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="mb-6">{faq.answer}</p>
                      {/* Author Info Section */}
                      {faq.author && faq.title && (
                        <div className="border-t border-[#d9a5a5] pt-4 text-center">
                          <p className="font-bold text-gray-800">{faq.author}</p>
                          <p className="text-sm text-gray-600 mt-1">({faq.title})</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
