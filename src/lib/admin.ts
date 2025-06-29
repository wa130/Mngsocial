import fs from 'fs/promises'
import path from 'path'

// Path ke data/admins.json
const adminPath = path.join(process.cwd(), 'tmp', 'data', 'admins.json')

// Ambil semua admin
export async function readAdmins() {
  const data = await fs.readFile(adminPath, 'utf-8')
  return JSON.parse(data)
}

// Cari admin berdasarkan API key
export async function getAdminByApiKey(apiKey: string) {
  const admins = await readAdmins()
  return admins.find((admin: any) => admin.apikey === apiKey)
}

// (Opsional) Simpan data admin ke file
export async function writeAdmins(admins: any[]) {
  await fs.writeFile(adminPath, JSON.stringify(admins, null, 2), 'utf-8')
}
