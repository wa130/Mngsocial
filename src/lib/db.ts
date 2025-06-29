import fs from 'fs/promises'
import path from 'path'

const dbPath = path.join(process.cwd(), 'tmp', 'data', 'database.json')

export async function readDB() {
  const data = await fs.readFile(dbPath, 'utf-8')
  return JSON.parse(data)
}

export async function writeDB(data: any) {
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
