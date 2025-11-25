import { fetchAdminContentFromServer } from '@/lib/admin-content'
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

  return <ProductsClient content={content} />
}
