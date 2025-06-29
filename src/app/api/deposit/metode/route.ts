import { NextRequest, NextResponse } from 'next/server'

const V_PEDIA_APIKEY = 'V-Pedia-2ea9jdshix8rnmzs'

export async function GET(req: NextRequest) {
  const res = await fetch('https://v-pedia.web.id/h2h/deposit/metode', {
    headers: { 'X-APIKEY': V_PEDIA_APIKEY }
  })

  const data = await res.json()
  return NextResponse.json(data)
}
