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
  const [activeWeight, setActiveWeight] = useState<string | null>(null)

  // Filter products based on active filters
  const filteredProducts = content.productList.filter((product) => {
    if (activeCategory && product.category !== activeCategory) return false
    if (activeWeight && product.weight !== activeWeight) return false
    return true
  })

  // Get unique weights from products
  const availableWeights = Array.from(new Set(content.productList.map(p => p.weight))).sort()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: content.hero.backgroundImage 
            ? `url(${content.hero.backgroundImage})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{content.hero.title}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">{content.hero.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Danh mục sản phẩm</h3>
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
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight Filter */}
            <div className="bg-white rounded-xl p-6 shadow-lg border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Khối lượng</h3>
              <div className="space-y-3">
                {availableWeights.map((weight) => (
                  <div key={weight} className="flex items-center space-x-2">
                    <Checkbox
                      id={`weight-${weight}`}
                      checked={activeWeight === weight}
                      onCheckedChange={(checked) => {
                        setActiveWeight(checked ? weight : null)
                      }}
                    />
                    <label
                      htmlFor={`weight-${weight}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {weight}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(activeCategory || activeWeight) && (
              <button
                onClick={() => {
                  setActiveCategory(null)
                  setActiveWeight(null)
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
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
                      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border hover:border-primary"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-5xl">{product.icon}</span>
                          {category && (
                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                              {category.name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">{product.weight}</span>
                          <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
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
    </div>
  )
}
