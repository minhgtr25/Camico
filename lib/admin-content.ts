import { AdminContent } from './types'

// Default admin content - stored in JSON format
export const defaultAdminContent: AdminContent = {
  pages: {
    home: {
      hero: {
        title: 'CAMICO',
        subtitle: 'Thức ăn xanh\nChăn nuôi bền vững',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ffd8709f-9ab7-4349-bed4-dc184fdce017-kmxomhG8Wwv1ZbeWy8pkqnOLpjxPbZ.png',
        buttonText: 'Tìm hiểu thêm',
        buttonLink: '#about',
      },
      about: {
        title: 'Giới thiệu về Camico',
        emoji: '🌾',
        content: [
          'CAMICO là thương hiệu tiên phong trong lĩnh vực thức ăn chăn nuôi sinh học tại Việt Nam, được ra đời với khát vọng mang đến nguồn dinh dưỡng an toàn, hiệu quả và thân thiện với môi trường.',
          'Chúng tôi kết hợp phụ phẩm thủy sản tái chế cùng chiết xuất thảo mộc tự nhiên để tạo nên nguồn thức ăn xanh thế hệ mới – giúp vật nuôi khỏe mạnh từ bên trong, phát triển tự nhiên và nói không với kháng sinh, hormone tăng trọng mang lại hiệu quả chăn nuôi bền vững cho người nông dân.',
          'CAMICO tin rằng một bữa ăn sạch bắt đầu từ nguồn thức ăn tinh khiết, và một nền nông nghiệp bền vững bắt đầu từ những người chăn nuôi có trách nhiệm. Chúng tôi đồng hành cùng người nông dân Việt trên hành trình nuôi dưỡng nguồn thực phẩm sạch, bảo vệ môi trường và hướng đến tương lai xanh.',
        ],
        quoteText: 'CAMICO – Đồng hành cùng người chăn nuôi Việt trên hành trình nuôi dưỡng nguồn thực phẩm sạch và cuộc sống xanh',
        logoImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-fDSaKmdvDI3BUN70NJeEOi5Z9RK0yD.png',
      },
      testimonials: [
        {
          id: 1,
          name: 'Anh Nguyễn Văn A',
          role: 'Chủ trang trại gà',
          image: '/vietnamese-farmer-with-chickens.jpg',
          rating: 5,
          feedback: 'Tôi tin dùng nhất là cám không có kháng sinh, gà nuôi thả tự nhiên mà thịt vẫn săn chắc, tham ngon. CAMICO đúng là dòng cám mà tôi đang tìm – vừa giúp tiết kiệm chi phí, vừa yên tâm về an toàn.',
        },
        {
          id: 2,
          name: 'Chị Trần Thị B',
          role: 'Chủ trang trại heo',
          image: '/vietnamese-woman-farmer-smiling.jpg',
          rating: 5,
          feedback: 'Lúc đầu tôi hơi lo vì nghe nói cám làm từ phụ phẩm cỏ, sợ tanh, sợ heo không ăn, dùng thử thấy heo ăn khỏe, tăng trọng ổn định mà phần khô, chuồng ít mùi hơn.',
        },
        {
          id: 3,
          name: 'Anh Lê Văn C',
          role: 'Chủ trang trại bò sữa',
          image: '/vietnamese-dairy-farmer.jpg',
          rating: 5,
          feedback: 'Bò sữa của tôi ăn CAMICO được 3 tháng, sản lượng sữa tăng rõ rệt, chất lượng sữa cũng tốt hơn. Quan trọng là không lo về kháng sinh hay hóa chất, vừa tốt cho bò vừa an tâm cho người tiêu dùng.',
        },
        {
          id: 4,
          name: 'Chị Phạm Thị D',
          role: 'Chủ trang trại vịt',
          image: '/vietnamese-woman-duck-farmer.jpg',
          rating: 5,
          feedback: 'Vịt của tôi dùng CAMICO lớn nhanh hơn, lông bóng mượt. Lợi suất thịt cao hơn kỳ vọng. Mình rất hài lòng, sẽ tiếp tục hợp tác lâu dài với CAMICO.',
        },
      ],
      gallery: [
        {
          id: '1',
          title: 'Giảm thiểu rác thải',
          image: '/sustainable-farming-waste-reduction.jpg',
          description: 'Cam kết bảo vệ môi trường và phát triển bền vững',
          fullDescription:
            'CAMICO cam kết giảm thiểu rác thải trong quá trình sản xuất, tái chế và tận dụng phụ phẩm nông nghiệp để tạo ra thức ăn chăn nuôi sinh học chất lượng cao, góp phần bảo vệ môi trường và phát triển nông nghiệp bền vững cho cộng đồng.',
        },
        {
          id: '2',
          title: 'Sản phẩm xanh',
          image: '/organic-green-livestock-feed-products.jpg',
          description: 'Thức ăn chăn nuôi sinh học chất lượng cao',
          fullDescription:
            'Sản phẩm của CAMICO được sản xuất từ nguyên liệu hữu cơ, không sử dụng hóa chất độc hại, đảm bảo an toàn tuyệt đối cho vật nuôi. Thức ăn giàu dinh dưỡng giúp gia súc phát triển khỏe mạnh và cho năng suất cao.',
        },
        {
          id: '3',
          title: 'Chăn nuôi bền vững',
          image: '/sustainable-livestock-farming-practices.jpg',
          description: 'Phương pháp chăn nuôi thân thiện với môi trường',
          fullDescription:
            'Chúng tôi hỗ trợ nông dân áp dụng phương pháp chăn nuôi bền vững, giảm thiểu tác động tiêu cực đến môi trường. Sản phẩm của CAMICO giúp cải thiện sức khỏe đàn vật nuôi, tăng năng suất và lợi nhuận cho người chăn nuôi.',
        },
        {
          id: '4',
          title: 'Nguồn gốc tự nhiên',
          image: '/natural-organic-ingredients-farming.jpg',
          description: 'Nguyên liệu tự nhiên từ thiên nhiên',
          fullDescription:
            'Tất cả nguyên liệu được lựa chọn kỹ lưỡng từ các trang trại hữu cơ có nguồn gốc rõ ràng. CAMICO tin tưởng vào sức mạnh của thiên nhiên, mang đến những sản phẩm thức ăn chăn nuôi tinh khiết và an toàn nhất.',
        },
      ],
      newsHighlights: [
        {
          id: 1,
          title: 'CAMICO – Giải pháp thức ăn xanh cho chăn nuôi bền vững',
          excerpt: 'Trong bối cảnh nhu cầu thực phẩm an toàn ngày càng tăng...',
          date: '2024-01-15',
          image: 'https://images.unsplash.com/photo-1500673021381-311825612f7e?w=400&h=300&fit=crop',
          category: 'Tin công ty',
          featured: true,
        },
      ],
      contactInfo: {
        phone: '+84 (0) 123 456 789',
        email: 'info@camico.com.vn',
        address: 'Số 123 Đường ABC, Phường XYZ, Quận 1, Thành phố Hồ Chí Minh',
        country: 'Việt Nam',
      },
      contactForm: {
        logo: '/images/logo.png',
        title: 'Đăng ký nhận thông tin',
        subtitle: 'Thức ăn xanh cho chăn nuôi bền vững',
        buttonText: 'Nhận ngay',
      },
    },
    about: {
      hero: {
        title: 'Về Chúng Tôi',
        subtitle: 'Tìm hiểu thêm về CAMICO',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ffd8709f-9ab7-4349-bed4-dc184fdce017-kmxomhG8Wwv1ZbeWy8pkqnOLpjxPbZ.png',
      },
      sections: [],
      contactInfo: {
        phone: '+84 (0) 123 456 789',
        email: 'info@camico.com.vn',
        address: 'Số 123 Đường ABC, Phường XYZ, Quận 1, Thành phố Hồ Chí Minh',
        country: 'Việt Nam',
      },
    },
    contact: {
      hero: {
        title: 'Liên Hệ Với Chúng Tôi',
        subtitle: 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với CAMICO ngay hôm nay.',
      },
      contactCards: [
        {
          icon: 'Phone',
          title: 'Số điện thoại',
          description: 'Liên hệ trực tiếp',
          value: '(+84) 123 456 789',
        },
        {
          icon: 'Mail',
          title: 'Email',
          description: 'Gửi email cho chúng tôi',
          value: 'info@camico.com.vn',
        },
        {
          icon: 'MapPin',
          title: 'Địa chỉ',
          description: 'Văn phòng chính',
          value: 'Số 123 Đường ABC, Quận 1, TP. Hồ Chí Minh, Việt Nam',
        },
      ],
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4582.82993520069!2d105.78123107596934!3d21.014323688272853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abcc1f4d5cef%3A0xd0246a423eb425f3!2zQ1Q1RCBN4buFIFRyw6wgSOG6oQ!5e1!3m2!1svi!2s!4v1764005651967!5m2!1svi!2s',
    },
    products: {
      hero: {
        title: 'SẢN PHẨM CỦA CAMICO',
        subtitle: '',
      },
      categories: [
        { id: 'heo-thit', name: 'Thức ăn cho Heo Thịt', icon: '🐷' },
        { id: 'ga', name: 'Thức ăn cho Gà Thả Vườn', icon: '🐔' },
      ],
      productList: [
        {
          id: 1,
          name: 'Thức ăn cho Heo Thịt (30-75kg)',
          category: 'heo-thit',
          weight: '25kg',
          description: 'Thức ăn tổng hợp cho Heo Thịt (30 - 75kg). Định dưỡng giúp heo phát triển khung xương, cơ bắp và tăng trưởng nhanh, đông thời.',
          icon: '🐷',
        },
        {
          id: 2,
          name: 'Thức ăn cho Heo Thịt (75kg - xuất chuồng)',
          category: 'heo-thit',
          weight: '25kg',
          description: 'Thức ăn tổng hợp cho Heo Thịt (75kg-xuất chuồng). Thiết kế nhằm tối ưu trong cuối cùng, giúp heo đạt trọng lượng mong muốn trong thời gian ngắn nhất.',
          icon: '🐷',
        },
        {
          id: 3,
          name: 'Thức ăn cho Gà Thả Vườn (46 ngày tuổi - xuất chuồng)',
          category: 'ga',
          weight: '15kg',
          description: 'Thức ăn tổng hợp cho Gà Thả Vườn (46 ngày - xuất chuồng). Sản phẩm bổ sung enzyme tiêu hóa và khoáng chất tự nhiên, giúp gà phát triển có thịt săn chắc, da vàng đẹp.',
          icon: '🐔',
        },
      ],
    },
    aboutPartners: {
      hero: {
        title: 'Đối tác chiến lược',
        subtitle: 'Cùng phát triển tương lai bền vững',
        backgroundImage: '/images/ffd8709f-9ab7-4349-bed4-dc184fdce017.png',
      },
      intro: {
        title: 'Đối tác của chúng tôi',
        subtitle: 'Chúng tôi rất vinh dự được đồng hành cùng các thương hiệu',
      },
      benefits: [
        {
          id: 1,
          icon: '🌿',
          title: 'Nâng cao uy tín và hình ảnh thương hiệu xanh',
          description: 'Camico giúp đối tác ghi dấu gia tăng thương hiệu thông qua động hành trong chuyên truyền thông xanh vững.',
        },
        {
          id: 2,
          icon: '🌍',
          title: 'Mở rộng mạng lưới kinh doanh và cơ hội thị trường',
          description: 'Tiếp cận cơ hội kinh doanh rộng lớn, thị trường mới và khách hàng mới trong lĩnh vực nông nghiệp sinh học.',
        },
        {
          id: 3,
          icon: '🔬',
          title: 'Tiếp cận công nghệ sinh học và giải pháp tiên tiến',
          description: 'Được tiếp cận công nghệ tiên tiến, giải pháp thông minh, chuỗi hỗ trợ từ nghiên cứu đến triển khai thị trường.',
        },
        {
          id: 4,
          icon: '🤝',
          title: 'Hợp tác minh bạch – phát triển bền vững cùng nhau',
          description: 'Các nhóm tham gia hợp tác được xây dựng trên cơ sở lợi ích chung, hướng tới phát triển lâu dài cho cả hai bên.',
        },
        {
          id: 5,
          icon: '📢',
          title: 'Đóng góp truyền thông và quảng bá thương hiệu',
          description: 'Phối hợp trong các hoạt động truyền thông, hội thảo hiệu quả, quảng bá sản phẩm và hình ảnh công nghiệp.',
        },
      ],
      cta: {
        title: 'Sẵn sàng hợp tác?',
        subtitle: 'Hãy liên hệ với CAMICO để cùng xây dựng tương lai bền vững',
        buttonText: 'Liên hệ ngay',
      },
    },
    aboutMission: {
      hero: {
        image: '/images/anh-hero.png',
      },
      backgroundImage: '/images/design-mode/00d08d10-a02c-48fd-8d06-ea6e8d4d9a47.png',
      companyName: 'CÔNG TY CỔ PHẦN CAMICO',
      vision: 'Trở thành thương hiệu dẫn đầu Việt Nam trong lĩnh vực thức ăn chăn nuôi sinh học, hướng tới xuất khẩu ra khu vực ASEAN vào năm 2035. CAMICO định hướng trở thành biểu tượng của nông nghiệp xanh, nơi hội tụ khoa học, thiên nhiên và con người, góp phần xây dựng hệ sinh thái chăn nuôi bền vững và tự chủ cho Việt Nam.',
      mission: {
        description: 'Mang đến giải pháp dinh dưỡng xanh – an toàn – hiệu quả',
        points: [
          'Vì sức khỏe vật nuôi và Sức khỏe người tiêu dùng',
          'CAMICO không chỉ nuôi dưỡng vật nuôi, mà còn nuôi dưỡng hy vọng và tương lai cho người nông dân Việt Nam.',
        ],
      },
      coreValues: [
        'Trung thực & Trách nhiệm',
        'Đổi mới & Sáng tạo',
        'Dũng cảm & Chia sẻ',
        'Bền vững & Nhân văn',
        'Chất lượng & Niềm tin',
      ],
    },
    aboutMessage: {
      hero: {
        image: '/images/anh-hero.png',
      },
      backgroundImage: '/images/design-mode/00d08d10-a02c-48fd-8d06-ea6e8d4d9a47.png',
      title: 'THƯ NGỎ',
      subtitle: 'Thông điệp nhà sáng lập',
      greeting: 'Kính gửi: Quý khách hàng, đối tác và bạn bè,',
      paragraphs: [
        '"Từ biển xanh, chúng tôi nhìn thấy tương lai của nông nghiệp Việt."',
        'Camico ra đời với một niềm tin giản dị: mọi thứ tưởng chừng bỏ đi đều có thể trở nên tốt đẹp hơn – nếu chúng ta sẵn sàng thay đổi và chịu trách nhiệm với môi trường. Những vụn cá nhỏ bé bị lãng quên ngoài khơi, qua bàn tay con người và công nghệ sinh học, có thể trở thành hạt cám xanh – nuôi dưỡng vật nuôi, con người và cả tương lai bền vững của đất nước.',
        'Chúng tôi không chỉ cần xuất cảm, mà còn tái sinh niềm tin của người nông dân, tái thiết giá trị của phụ phẩm thủy sản và tái tạo mô hình kinh tế tuần hoàn cho Việt Nam.',
        'Hành trình của Camico không chỉ là hành trình kinh doanh, mà là hành trình của những người tin rằng nông nghiệp Việt có thể phát triển xanh – sạch – và có trách nhiệm.',
        'Chúng tôi đồng hành cùng người nông dân Việt trên hành trình nuôi dưỡng nguồn thực phẩm sạch, bảo vệ môi trường và hướng đến tương lai xanh.',
      ],
      quote: '"Biến phụ phẩm thành giá trị, biến niềm tin thành hành động – đó là Camico."',
      signature: 'CAMICO',
    },
  },
  partners: [
    { id: 1, name: 'Partner 1', logo: '/images/logo-green.png' },
    { id: 2, name: 'Partner 2', logo: '/images/logo-green.png' },
    { id: 3, name: 'Partner 3', logo: '/images/logo-green.png' },
    { id: 4, name: 'Partner 4', logo: '/images/logo-green.png' },
    { id: 5, name: 'Partner 5', logo: '/images/logo-green.png' },
    { id: 6, name: 'Partner 6', logo: '/images/logo-green.png' },
  ],
  products: [
    {
      id: '1',
      name: 'heo-thit-30-75kg',
      title: 'Thức ăn cho Heo Thịt (30-75kg)',
      tagline: 'Chế độ ăn toàn phần an toàn',
      benefits: [
        { id: '1', text: 'Không có kháng sinh hay hormone tăng trọng' },
        { id: '2', text: 'Tái chế phụ phẩm thủy sản bền vững' },
        { id: '3', text: 'Tăng trọng ổn định mà không gây bệnh tật' },
      ],
      description: 'Sản phẩm được thiết kế đặc biệt cho heo từ 30-75kg',
      image: 'https://images.unsplash.com/photo-1500673021381-311825612f7e?w=600&h=400&fit=crop',
    },
    {
      id: '2',
      name: 'ga-thit-tre-em',
      title: 'Thức ăn cho Heo Thịt (75kg - xuất chuồng)',
      tagline: 'Dinh dưỡng cân đối cho gà thịt',
      benefits: [
        { id: '1', text: 'Thành phần dễ tiêu hoá' },
        { id: '2', text: 'Tăng sức đề kháng tự nhiên' },
        { id: '3', text: 'Hương vị tự nhiên, thúc đẩy ăn ngon' },
      ],
      description: 'Công thức cân bằng dành cho gà thịt, tối ưu tăng trọng và chất lượng thịt.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
      specifications: [],
      faqs: [],
    },
    {
      id: '3',
      name: 'bo-sua-hoan-hao',
      title: 'Thức ăn cho Gà Thả Vườn (46 ngày tuổi - xuất chuồng)',
      tagline: 'Nuôi bò sữa khỏe, cho sữa chất lượng',
      benefits: [
        { id: '1', text: 'Cân bằng vi chất quản lý tiêu hoá' },
        { id: '2', text: 'Hỗ trợ sản lượng sữa' },
        { id: '3', text: 'Giảm stress cho đàn' },
      ],
      description: 'Thức ăn đặc biệt cho bò sữa, giúp ổn định sản lượng và chất lượng sữa.',
      image: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=600&h=400&fit=crop',
      specifications: [],
      faqs: [],
    },
  ],
  news: [
    {
      id: 1,
      title: 'CAMICO – Giải pháp thức ăn xanh cho chăn nuôi bền vững',
      excerpt: 'Trong bối cảnh nhu cầu thực phẩm an toàn ngày càng tăng...',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1500673021381-311825612f7e?w=400&h=300&fit=crop',
      category: 'Tin công ty',
      featured: true,
    },
  ],
  faqs: {
    '1': [
      {
        id: 1,
        question: 'Sản phẩm CAMICO có an toàn không?',
        answer: 'Vâng, sản phẩm CAMICO không chứa kháng sinh, hormone tăng trọng và được sản xuất từ các nguyên liệu tự nhiên.',
        author: 'Chuyên gia dinh dưỡng',
        title: 'Trưởng bộ phận R&D',
      },
    ],
  },
  favicon: {
    lightIcon: '/icon-light-32x32.png',
    darkIcon: '/icon-dark-32x32.png',
    svgIcon: '/icon.svg',
    appleIcon: '/apple-icon.png',
  },
}

// Get admin content from localStorage or use default
export function getAdminContent(): AdminContent {
  try {
    if (globalThis.window !== undefined) {
      const stored = globalThis.window.localStorage.getItem('adminContent')
      if (stored) {
        return JSON.parse(stored)
      }
    }
  } catch (e) {
    console.error('Error getting admin content:', e)
  }
  return defaultAdminContent
}

// Save admin content to localStorage
export function saveAdminContent(content: AdminContent): void {
  try {
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.setItem('adminContent', JSON.stringify(content))
    }
  } catch (e) {
    console.error('Error saving admin content:', e)
  }
}

// Fetch admin content from server API
export async function fetchAdminContentFromServer(): Promise<AdminContent> {
  try {
    const response = await fetch('/api/admin/content', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch admin content')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching admin content from server:', error)
    return defaultAdminContent
  }
}

// Save admin content to server API
export async function saveAdminContentToServer(content: AdminContent): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    })
    
    if (!response.ok) {
      throw new Error('Failed to save admin content')
    }
    
    return true
  } catch (error) {
    console.error('Error saving admin content to server:', error)
    return false
  }
}

// Reset admin content to default on server
export async function resetAdminContentOnServer(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/content', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to reset admin content')
    }
    
    return true
  } catch (error) {
    console.error('Error resetting admin content on server:', error)
    return false
  }
}
