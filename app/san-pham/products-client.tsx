'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Checkbox } from '@/components/ui/checkbox'
import type { ProductsPageContent } from '@/lib/types'

interface ProductsClientProps {
  content: ProductsPageContent
}

export default function ProductsClient({ content }: ProductsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Filter products based on active category
  const filteredProducts = content.productList.filter((product) => {
    if (activeCategory && product.category !== activeCategory) return false
    return true
  })

  return (
    <main className="flex-1">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-[#2d5016]/10">
              <h3 className="text-xl font-bold mb-4 text-[#2d5016]">Danh mục sản phẩm</h3>
              <div className="space-y-3">
                {content.categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={activeCategory === category.id}
                      onCheckedChange={(checked) => {
                        setActiveCategory(checked ? category.id : null)
                      }}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2 text-gray-700"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeCategory && (
              <button
                onClick={() => {
                  setActiveCategory(null)
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg text-white py-3 px-4 rounded-lg transition-all duration-300 font-semibold"
              >
                Xóa bộ lọc
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const category = content.categories.find(c => c.id === product.category)
                  return (
                    <Link
                      key={product.id}
                      href={`/san-pham/${product.id}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-[#2d5016]/10 hover:border-[#2d5016]/30 hover:-translate-y-1"
                    >
                      <div className="p-6 bg-gradient-to-br from-white to-[#f5f5dc]/20">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{product.icon}</span>
                          {category && (
                            <span className="text-xs bg-gradient-to-r from-[#2d5016] to-[#3d6826] text-white px-3 py-1 rounded-full font-semibold shadow-md">
                              {category.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-[#2d5016] mb-2 group-hover:text-[#3d6826] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-end">
                          <span className="text-[#2d5016] font-semibold group-hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                            Đọc thêm
                            <span className="text-xl">→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
