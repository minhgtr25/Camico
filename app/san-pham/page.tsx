"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Thức ăn cho Heo Thịt (30-75kg)",
    category: "heo-thit",
    weight: "25kg",
    description:
      "Thức ăn tổng hợp cho Heo Thịt (30 - 75kg). Định dưỡng giúp heo phát triển khung xương, cơ bắp và tăng trưởng nhanh, đông thời.",
    icon: "🐷",
  },
  {
    id: 2,
    name: "Thức ăn cho Heo Thịt (75kg - xuất chuồng)",
    category: "heo-thit",
    weight: "25kg",
    description:
      "Thức ăn tổng hợp cho Heo Thịt (75kg-xuất chuồng). Thiết kế nhằm tối ưu uất trong cuối cùng, giúp heo đạt trong lượng mỡ muối trong thời gian ngắn nhất. Công thức.",
    icon: "🐷",
  },
  {
    id: 3,
    name: "Thức ăn cho Gà Thả Vườn (46 ngày tuổi - xuất chuồng)",
    category: "ga",
    weight: "15kg",
    description:
      "Thức ăn tổng hợp cho Gà Thả Vườn (46 ngày - xuất chuồng). Sản phẩm bổ sung enzyme tiêu hóa và khoáng chất tự nhiên, giúp gà phát triển có thịt săn chắc, da vàng đẹp và mờ.",
    icon: "🐔",
  },
]

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeWeight, setActiveWeight] = useState<string | null>(null)

  const filteredProducts = products.filter((product) => {
    if (activeCategory && product.category !== activeCategory) return false
    if (activeWeight && product.weight !== activeWeight) return false
    return true
  })

  return (
    <main className="min-h-screen bg-[#f5f5dc]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-primary font-medium">Sản phẩm</span>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-sm mb-4 text-gray-800">Sản phẩm (3)</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="heo-thit"
                      checked={activeCategory === "heo-thit"}
                      onCheckedChange={(checked) => setActiveCategory(checked ? "heo-thit" : null)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="heo-thit" className="text-sm text-gray-700 cursor-pointer flex-1">
                      Thức ăn cho heo
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="heo-ve-bao"
                      checked={activeCategory === "heo-ve-bao"}
                      onCheckedChange={(checked) => setActiveCategory(checked ? "heo-ve-bao" : null)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="heo-ve-bao" className="text-sm text-gray-700 cursor-pointer flex-1">
                      Thức ăn cho heo về báo
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="ga"
                      checked={activeCategory === "ga"}
                      onCheckedChange={(checked) => setActiveCategory(checked ? "ga" : null)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="ga" className="text-sm text-gray-700 cursor-pointer flex-1">
                      Thức ăn cho gà
                    </label>
                  </div>
                </div>
              </div>

              {/* Weight Filter */}
              <div>
                <h3 className="font-bold text-sm mb-4 text-gray-800">Khối lượng sản phẩm</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="25kg"
                      checked={activeWeight === "25kg"}
                      onCheckedChange={(checked) => setActiveWeight(checked ? "25kg" : null)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="25kg" className="text-sm text-gray-700 cursor-pointer flex-1">
                      Bao 25kg
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="15kg"
                      checked={activeWeight === "15kg"}
                      onCheckedChange={(checked) => setActiveWeight(checked ? "15kg" : null)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="15kg" className="text-sm text-gray-700 cursor-pointer flex-1">
                      Bao 15kg
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-primary mb-2">SẢN PHẨM CỦA CAMICO</h1>
              
            </div>

            {/* Product Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
                <div className="text-4xl">🐷</div>
                <div>
                  <h3 className="font-bold text-gray-800">Thức ăn cho Heo Thịt</h3>
                  <p className="text-xs text-gray-500">Frame</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
                <div className="text-4xl">🐔</div>
                <div>
                  <h3 className="font-bold text-gray-800">Thức ăn cho Gà Thả Vườn</h3>
                  <p className="text-xs text-gray-500">Frame</p>
                </div>
              </div>
            </div>

            {/* Product Count */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">0{filteredProducts.length} SẢN PHẨM</h2>
            </div>

            {/* Products List */}
            <div className="space-y-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                    {/* Product Image/Icon */}
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg h-48 md:h-auto">
                      <div className="text-6xl">{product.icon}</div>
                    </div>

                    {/* Product Info */}
                    <div className="md:col-span-3">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase">{product.name}</h3>
                      <p className="text-gray-700 text-sm mb-6 leading-relaxed">{product.description}</p>
                      <Link href={`/san-pham/${product.id}`}>
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-6">
                          Xem sản phẩm
                        </Button>
                      </Link>
                    </div>
                  </div>
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
