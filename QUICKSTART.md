# ⚡ Quick Start - Vercel Image Upload

## 🎯 5-Minute Setup

### 1️⃣ Install Package
```bash
pnpm add @vercel/blob
```

### 2️⃣ Setup Vercel
```bash
vercel login
vercel link
```

### 3️⃣ Create Blob Store
1. Open: https://vercel.com/dashboard
2. Your Project → **Storage** → **Create Database**
3. Select **Blob** → Create
4. Copy the **BLOB_READ_WRITE_TOKEN**

### 4️⃣ Configure Environment
```bash
# Create .env.local
cp .env.local.example .env.local

# Paste your token into .env.local
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX
```

### 5️⃣ Test
```bash
# Test connection
node test-blob.mjs

# Start dev server
pnpm dev
```

### 6️⃣ Try Upload
1. http://localhost:3000/admin
2. Login: `admin2024`
3. Upload image → Click Browse → Select file
4. See preview → Click **Lưu**
5. ✅ Done!

### 7️⃣ Deploy
```bash
git add .
git commit -m "Add image upload"
git push
```

Vercel auto-deploys! 🚀

---

## 📚 Full Docs
- **Setup Guide:** `VERCEL_SETUP.md`
- **Summary:** `IMAGE_UPLOAD_README.md`
- **Vercel Docs:** https://vercel.com/docs/storage/vercel-blob

## ✨ What Changed?
- ✅ All URL inputs → Browse buttons
- ✅ Images → Vercel CDN (500GB/month free)
- ✅ 7 editors updated (Hero, Products, News, Gallery, About, Testimonials, Pages)

**Enjoy! 🎉**
