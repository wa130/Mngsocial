import { NextRequest, NextResponse } from 'next/server'
import { readDB } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

const DEPOSIT_PATH = path.join(process.cwd(), 'data', 'deposits.json')

export async function GET(req: NextRequest) {
  let deposits = []
  try {
    const raw = await fs.readFile(DEPOSIT_PATH, 'utf-8')
    deposits = JSON.parse(raw)
  } catch {}

  const db = await readDB()

  const suksesDeposits = deposits.filter((d: any) => d.status === 'success' || d.status === 'succes')

  const totalPerUser: Record<string, number> = {}
  for (const d of suksesDeposits) {
    if (!totalPerUser[d.user_id]) totalPerUser[d.user_id] = 0
    totalPerUser[d.user_id] += d.get_balance || 0
  }

  const sorted = Object.entries(totalPerUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)

  const topDepositors = sorted.map(([userId, total], i) => {
    const user = db.users.find((u: any) => u.id === userId)
    return {
      rank: i + 1,
      user_id: userId,
      username: user?.username || 'Unknown',
      profile_picture: user?.profile_picture || '',
      total_deposit: total
    }
  })

  return NextResponse.json({
    success: true,
    count: topDepositors.length,
    top_depositors: topDepositors
  })
}
