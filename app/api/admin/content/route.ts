import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { defaultAdminContent } from '@/lib/admin-content'

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'admin-content.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// GET: Lấy nội dung admin
export async function GET() {
  try {
    await ensureDataDirectory()
    
    try {
      const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
      const data = JSON.parse(fileContent)
      return NextResponse.json(data)
    } catch (error) {
      // Nếu file chưa tồn tại, trả về default content
      console.log('Admin content file not found, returning default:', error)
      return NextResponse.json(defaultAdminContent)
    }
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
    await ensureDataDirectory()
    
    const content = await request.json()
    
    // Lưu vào file JSON
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(content, null, 2),
      'utf-8'
    )
    
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
    await ensureDataDirectory()
    
    await fs.writeFile(
      DATA_FILE_PATH,
      JSON.stringify(defaultAdminContent, null, 2),
      'utf-8'
    )
    
    return NextResponse.json({ success: true, message: 'Content reset to default' })
  } catch (error) {
    console.error('Error resetting admin content:', error)
    return NextResponse.json(
      { error: 'Failed to reset admin content' },
      { status: 500 }
    )
  }
}
