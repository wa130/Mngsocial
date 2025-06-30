import fs from 'fs/promises'
import path from 'path'

// Menggunakan path absolut ke /tmp agar bisa write di Vercel
const dbPath = path.join('/tmp', 'database.json')

// Pastikan file JSON ada saat pertama kali digunakan
async function ensureDBExists() {
  try {
    await fs.access(dbPath)
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ users: [] }, null, 2), 'utf-8')
  }
}

export async function readDB() {
  await ensureDBExists()
  const data = await fs.readFile(dbPath, 'utf-8')
  return JSON.parse(data)
}

export async function writeDB(data: any) {
  await ensureDBExists()
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8')
}

// 🔥 Fungsi auto hapus user tidak aktif
export async function cleanupInactiveUsers(): Promise<number> {
  const db = await readDB()
  const now = new Date()
  const before = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000) // 20 hari
  const originalLength = db.users.length
  db.users = db.users.filter((user: any) => {
    const regDate = new Date(user.register_date)
    const isOld = regDate < before
    const isAdmin = user.admin === true
    const hasDeposit = user.total_deposit > 0
    return isAdmin || hasDeposit || !isOld
  })
  const deleted = originalLength - db.users.length
  await writeDB(db)
  return deleted
}
