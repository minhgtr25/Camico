# CAMICO Website

Website chính thức của CAMICO - Công ty sản xuất thức ăn chăn nuôi chất lượng cao.

## 🚀 Công nghệ sử dụng

- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn/ui
- **Database**: Vercel KV (Upstash Redis)
- **Image Storage**: Cloudinary
- **Deployment**: Vercel

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/minhgtr25/Camico.git
cd Camico

# Cài đặt dependencies
pnpm install

# Tạo file .env.local và thêm các biến môi trường
cp .env.example .env.local
```

## 🔐 Biến môi trường

Tạo file `.env.local` với nội dung sau:

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Vercel KV (Production only)
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token
```

## 🏃 Chạy dự án

```bash
# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start
```

## 📂 Cấu trúc dự án

```
├── app/
│   ├── admin/              # Admin panel với sidebar navigation
│   ├── lien-he/            # Trang liên hệ (dynamic)
│   ├── san-pham/           # Trang sản phẩm (dynamic)
│   ├── tin-tuc/            # Trang tin tức (dynamic)
│   ├── ve-chung-toi/       # Các trang về công ty (dynamic)
│   │   ├── doi-tac/        # Đối tác
│   │   ├── su-menh/        # Sứ mệnh
│   │   └── thong-diep/     # Thông điệp
│   └── api/
│       ├── admin/content/  # API endpoint cho admin content
│       └── upload/         # API endpoint cho upload ảnh
├── components/             # Reusable components
├── lib/
│   ├── admin-content.ts    # Admin content functions với Vercel KV
│   ├── types.ts            # TypeScript type definitions
│   └── utils.ts            # Utility functions
└── public/                 # Static assets

```

## 🎨 Tính năng

### Website
- ✅ Trang chủ với Hero, Giới thiệu, Sản phẩm, Tin tức
- ✅ Trang Sản phẩm với filter theo danh mục và khối lượng
- ✅ Trang Tin tức với featured articles
- ✅ Trang Liên hệ với Google Maps embed
- ✅ Trang Về chúng tôi (Đối tác, Sứ mệnh, Thông điệp)
- ✅ Server-side rendering (ƒ dynamic) cho SEO tốt nhất
- ✅ Responsive design (mobile, tablet, desktop)

### Admin Panel
- ✅ Sidebar navigation với search functionality
- ✅ 4 nhóm trang: Bắt đầu, Trang chủ, Trang riêng, Về chúng tôi
- ✅ CRUD đầy đủ cho tất cả content types
- ✅ Image upload lên Cloudinary
- ✅ Real-time save/load với Vercel KV
- ✅ Password protected (mật khẩu mặc định: `admin123`)
- ✅ Toast notifications cho mọi hành động
- ✅ Hướng dẫn sử dụng chi tiết

## 🔧 Admin Panel

### Truy cập
1. Vào `/admin`
2. Đăng nhập với mật khẩu: `admin123`
3. Chọn trang cần edit từ sidebar
4. Thực hiện thay đổi
5. Nhấn "Lưu Thay Đổi"

### Đổi mật khẩu
Mở `app/admin/page.tsx` và tìm dòng:
```typescript
if (password === 'admin123') {
```
Thay `admin123` bằng mật khẩu mới.

### Các trang có thể quản lý
- **Home**: Hero, About, Products, News, Testimonials, Gallery, Contact, FAQs
- **Pages**: Contact Page, Products Page
- **About**: Partners, Mission, Message

## 🚢 Deploy lên Vercel

1. Push code lên GitHub:
```bash
git add .
git commit -m "Update: Admin panel và tất cả trang động"
git push origin main
```

2. Kết nối repository với Vercel:
   - Vào [Vercel Dashboard](https://vercel.com)
   - Import repository từ GitHub
   - Add environment variables:
     - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `KV_REST_API_URL` (từ Vercel KV)
     - `KV_REST_API_TOKEN` (từ Vercel KV)

3. Deploy!

## 📊 Build Output

```
Route (app)
├ ƒ /                          ← Trang chủ (dynamic)
├ ○ /admin                     ← Admin Panel (static)
├ ƒ /lien-he                   ← Liên hệ (dynamic)
├ ƒ /san-pham                  ← Sản phẩm (dynamic)
├ ƒ /tin-tuc                   ← Tin tức (dynamic)
├ ƒ /ve-chung-toi/doi-tac      ← Đối tác (dynamic)
├ ƒ /ve-chung-toi/su-menh      ← Sứ mệnh (dynamic)
└ ƒ /ve-chung-toi/thong-diep   ← Thông điệp (dynamic)

ƒ  (Dynamic)  server-rendered on demand
○  (Static)   prerendered as static content
```

## 🔒 Bảo mật

- ⚠️ Đổi mật khẩu admin trước khi deploy production
- ✅ File `.env.local` đã được gitignore
- ✅ API routes được protect với proper error handling
- ✅ Cloudinary API keys được lưu trên server

## 📝 Ghi chú

- Tất cả data được lưu trên **Vercel KV** (Redis cloud)
- Images được upload lên **Cloudinary CDN**
- Server-side rendering cho SEO tốt
- Mobile-first responsive design

## 👥 Team

- Developer: GitHub Copilot + minhgtr25
- Version: 1.0.0
- Last Updated: November 2024

## 📄 License

Copyright © 2024 CAMICO. All rights reserved.
