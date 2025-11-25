# 🚀 Hướng Dẫn Deploy lên Vercel với Image Upload

## 📋 Tổng Quan
Website đã được tích hợp **Vercel Blob Storage** để upload ảnh trực tiếp từ Admin Panel. Tất cả các trường nhập URL hình ảnh đã được thay thế bằng nút **Browse** để chọn file từ máy tính.

## ✨ Các File Mới Được Tạo
1. **`components/image-uploader.tsx`** - Component upload ảnh tái sử dụng
2. **`app/api/upload/route.ts`** - API endpoint xử lý upload lên Vercel Blob
3. **`VERCEL_SETUP.md`** - File hướng dẫn này

## 🔧 Các Thay Đổi Trong Admin Panel
Tất cả các editor đã được tích hợp `ImageUploader`:
- ✅ **Hero Section** - Hero image
- ✅ **About Section** - Logo image  
- ✅ **Testimonials** - Avatar người đánh giá
- ✅ **Gallery** - Slide images (thêm mới + chỉnh sửa)
- ✅ **Products** - Product images (thêm mới + chỉnh sửa)
- ✅ **News** - Article featured images (thêm mới + chỉnh sửa)
- ✅ **Pages** - Hero images của các trang con

## 🛠️ Bước 1: Cài Đặt Package

```bash
pnpm add @vercel/blob
```

## 🔗 Bước 2: Link Project với Vercel

Nếu chưa có project trên Vercel:

```bash
pnpm add -g vercel
vercel login
vercel link
```

Làm theo hướng dẫn:
- Chọn scope (account/team)
- Chọn "Link to existing project" hoặc "Create new project"
- Confirm project settings

## 💾 Bước 3: Tạo Vercel Blob Store

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào tab **Storage**
4. Click **Create Database**
5. Chọn **Blob** → **Continue**
6. Đặt tên store (ví dụ: `website-images`)
7. Click **Create**

## 🔑 Bước 4: Lấy Token & Cấu Hình Local

1. Sau khi tạo Blob store, copy **Read-Write Token**
2. Tạo file `.env.local` trong thư mục root:

```bash
echo 'BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX' > .env.local
```

**Lưu ý:** File `.env.local` đã có trong `.gitignore`, sẽ không bị commit lên Git.

## ✅ Bước 5: Test Upload Local

Tạo file test `test-blob.mjs`:

```javascript
import { put, list } from '@vercel/blob'

async function testBlob() {
  try {
    console.log('🧪 Testing Vercel Blob connection...')
    
    // Test upload
    const blob = await put('test.txt', 'Hello Vercel Blob!', {
      access: 'public',
    })
    console.log('✅ Upload successful:', blob.url)
    
    // Test list
    const { blobs } = await list()
    console.log('📂 Files in blob store:', blobs.length)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testBlob()
```

Chạy test:

```bash
node test-blob.mjs
```

Nếu thành công, bạn sẽ thấy:
```
🧪 Testing Vercel Blob connection...
✅ Upload successful: https://xxxxx.public.blob.vercel-storage.com/test.txt
📂 Files in blob store: 1
```

## 🎨 Bước 6: Test Upload Trong Admin Panel

1. Chạy dev server:
```bash
pnpm dev
```

2. Truy cập http://localhost:3000/admin
3. Đăng nhập (mật khẩu: `admin2024`)
4. Chọn bất kỳ tab nào (Hero, Products, News, v.v.)
5. Thử upload ảnh bằng nút **Browse**
6. Kiểm tra:
   - Loading spinner xuất hiện
   - Preview ảnh hiển thị sau khi upload
   - Click **Lưu** để save URL vào localStorage
   - Refresh trang → ảnh vẫn hiển thị

## 🚢 Bước 7: Deploy lên Vercel

### Commit & Push Code

```bash
git add .
git commit -m "Add Vercel Blob image upload to admin panel"
git push
```

### Deploy

**Cách 1: Tự động deploy (nếu đã connect GitHub/GitLab)**
- Vercel sẽ tự động deploy sau mỗi push

**Cách 2: Deploy thủ công**
```bash
vercel --prod
```

### Xác Nhận Token Trong Production

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project → **Settings** → **Environment Variables**
3. Xác nhận `BLOB_READ_WRITE_TOKEN` có trong danh sách
4. Nếu chưa có, add manually:
   - **Key:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** Token bạn copy từ Blob store
   - **Environment:** Production, Preview, Development (chọn tất cả)

## 🎯 Bước 8: Test Trên Production

1. Truy cập domain production: `https://your-site.vercel.app/admin`
2. Đăng nhập admin
3. Test upload ảnh
4. Kiểm tra ảnh hiển thị trên frontend: `/`, `/san-pham`, `/tin-tuc`, v.v.

## 🔍 Troubleshooting

### ❌ Lỗi: "Missing BLOB_READ_WRITE_TOKEN"

**Nguyên nhân:** Token chưa được set trong environment variables

**Giải pháp:**
- Local: Kiểm tra file `.env.local`
- Production: Add token trong Vercel Dashboard → Settings → Environment Variables

### ❌ Upload thành công nhưng ảnh không hiển thị

**Nguyên nhân:** URL không được lưu vào localStorage

**Giải pháp:**
- Sau khi upload, nhớ click **Lưu** trong Admin Panel
- Kiểm tra DevTools → Application → Local Storage → `adminContent`

### ❌ Lỗi CORS khi upload

**Nguyên nhân:** Blob store chưa được cấu hình đúng

**Giải pháp:**
- Xác nhận Blob store được tạo trong cùng project
- Vercel Blob không cần cấu hình CORS thủ công

### ❌ File quá lớn

**Giới hạn:** 10MB/file (đã set trong `image-uploader.tsx`)

**Giải pháp:**
- Nén ảnh trước khi upload (dùng TinyPNG, Squoosh, v.v.)
- Tăng giới hạn trong code nếu cần (line 44 trong `image-uploader.tsx`)

## 📊 Quota & Giá

### Free Tier (Hobby Plan)
- ✅ **500GB bandwidth/tháng**
- ✅ **Unlimited storage**
- ✅ **CDN toàn cầu**
- ✅ **Automatic image optimization**

### Upgrade Plans
- **Pro:** $20/USD/tháng - 1TB bandwidth
- **Enterprise:** Custom pricing

Chi tiết: https://vercel.com/pricing/storage

## 🔐 Security Best Practices

1. **Không commit `.env.local`** - Đã có trong `.gitignore`
2. **Rotate token định kỳ** - Tạo token mới trong Blob store settings
3. **Validate file types** - Chỉ cho phép image/* (đã implement)
4. **Limit file size** - 10MB max (đã implement)
5. **Rate limiting** - Vercel tự động handle

## 🎉 Hoàn Thành!

Bây giờ bạn đã có:
- ✅ Admin Panel với file upload thay vì nhập URL
- ✅ Ảnh được lưu trên Vercel Blob CDN (nhanh, bền vững)
- ✅ 500GB bandwidth miễn phí/tháng
- ✅ Auto-scaling, không lo về infrastructure

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra [Vercel Docs - Blob Storage](https://vercel.com/docs/storage/vercel-blob)
2. Check logs: `vercel logs`
3. DevTools Console (F12) → kiểm tra network requests

---

**Chúc bạn deploy thành công! 🚀**
