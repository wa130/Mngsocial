import { readDB } from '@/lib/db'

export async function withUser(apikey: string) {
  if (!apikey || !apikey.startsWith('mng-')) {
    return { error: 'API Key tidak valid' }
  }

  const db = await readDB()
  const user = db.users.find((u: any) => u.apikey === apikey)

  if (!user) {
    return { error: 'User tidak ditemukan' }
  }

  const isReseller = user.reseller === true
  const margin = isReseller ? 30 : 50

  return {
    user,
    isReseller,
    margin
  }
}
