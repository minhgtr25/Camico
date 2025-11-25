import { fetchAdminContentFromServer } from '@/lib/admin-content'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import ProductsClient from './products-client'

export const dynamic = 'force-dynamic'

export default async function SanPhamPage() {
  const adminContent = await fetchAdminContentFromServer()
  
  const content = adminContent.pages?.products || {
    hero: {
      title: 'SẢN PHẨM CỦA CAMICO',
      subtitle: 'Chúng tôi cung cấp các sản phẩm thức ăn chăn nuôi chất lượng cao',
      backgroundImage: '',
    },
    categories: [
      { id: 'heo-thit', name: 'Thức ăn cho heo thịt', icon: '🐷' },
      { id: 'ga', name: 'Thức ăn cho gà', icon: '🐔' },
    ],
    productList: [
      {
        id: 1,
        name: 'Thức ăn heo thịt 25kg',
        category: 'heo-thit',
        weight: '25kg',
        description: 'Thức ăn chất lượng cao cho heo thịt, giúp tăng trọng nhanh và hiệu quả',
        icon: '🐷',
      },
      {
        id: 2,
        name: 'Thức ăn gà 25kg',
        category: 'ga',
        weight: '25kg',
        description: 'Thức ăn hoàn chỉnh cho gà, tăng cường sức khỏe và năng suất',
        icon: '🐔',
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5dc]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2d5016] to-[#3d6826] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content.hero?.title || 'SẢN PHẨM CỦA CAMICO'}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {content.hero?.subtitle || 'Thức ăn xanh - Chăn nuôi bền vững - An toàn cho vật nuôi'}
          </p>
        </div>
      </section>

      <ProductsClient content={content} />
      
      <Footer />
    </div>
  )
}
