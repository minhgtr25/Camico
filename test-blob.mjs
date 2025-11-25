import { put, list } from '@vercel/blob'

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
  console.log('\n🎉 Connection successful! You can now use Vercel Blob.')
  
} catch (error) {
  console.error('❌ Error:', error.message)
  console.error('\n📝 Troubleshooting:')
  console.error('1. Make sure BLOB_READ_WRITE_TOKEN is set in .env.local')
  console.error('2. Run: vercel link (if not done)')
  console.error('3. Create Blob store in Vercel Dashboard → Storage')
}

