import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { defaultAdminContent } from '@/lib/admin-content'

const KV_KEY = 'admin-content'

// Disable caching for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET: Lấy nội dung admin
export async function GET() {
  try {
    const content = await kv.get(KV_KEY)
    
    if (!content) {
      // Nếu chưa có data, trả về default content
      console.log('Admin content not found in KV, returning default')
      return NextResponse.json(defaultAdminContent, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        },
      })
    }
    
    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error reading admin content:', error)
    return NextResponse.json(
      { error: 'Failed to read admin content' },
      { status: 500 }
    )
  }
}

// POST: Lưu nội dung admin
export async function POST(request: NextRequest) {
  try {
    const content = await request.json()
    
    console.log('Saving admin content to KV:', {
      hasContactPage: !!content?.pages?.contact,
      contactCards: content?.pages?.contact?.contactCards
    })
    
    // Lưu vào Vercel KV
    await kv.set(KV_KEY, content)
    
    console.log('Successfully saved to KV')
    
    return NextResponse.json({ success: true, message: 'Content saved successfully' })
  } catch (error) {
    console.error('Error saving admin content:', error)
    return NextResponse.json(
      { error: 'Failed to save admin content' },
      { status: 500 }
    )
  }
}

// DELETE: Reset về nội dung mặc định
export async function DELETE() {
  try {
    // Lưu default content vào KV
    await kv.set(KV_KEY, defaultAdminContent)
    
    return NextResponse.json({ success: true, message: 'Content reset to default' })
  } catch (error) {
    console.error('Error resetting admin content:', error)
    return NextResponse.json(
      { error: 'Failed to reset admin content' },
      { status: 500 }
    )
  }
}
