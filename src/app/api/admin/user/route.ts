import { NextRequest, NextResponse } from 'next/server'
import { adminMiddleware } from '@/middleware/adminMiddleware'
import { readDB, writeDB } from '@/lib/db'

export async function PATCH(req: NextRequest) {
  const auth = await adminMiddleware(req)
  if (auth) return auth

  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'User ID wajib diisi' }, { status: 400 })

  const db = await readDB()
  const index = db.users.findIndex((u: any) => u.id === id)

  if (index === -1) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
  }

  db.users[index] = { ...db.users[index], ...updates }
  await writeDB(db)

  return NextResponse.json({ message: 'User berhasil diupdate', user: db.users[index] })
}

export async function DELETE(req: NextRequest) {
  const auth = await adminMiddleware(req)
  if (auth) return auth

  const { searchParams } = req.nextUrl
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID user diperlukan' }, { status: 400 })

  const db = await readDB()
  const user = db.users.find((u: any) => u.id === id)

  if (!user) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
  }

  db.users = db.users.filter((u: any) => u.id !== id)
  await writeDB(db)

  return NextResponse.json({ message: `User ${id} berhasil dihapus` })
}
