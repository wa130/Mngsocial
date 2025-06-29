import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function GET() {
  const tmpDir = path.join(process.cwd(), 'tmp', 'data')
  const zipPath = path.join(process.cwd(), 'tmp', 'backup.zip')

  try {
    await fs.access(tmpDir)

    const output = fsSync.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    archive.pipe(output)

    const files = await fs.readdir(tmpDir)
    for (const file of files) {
      const filePath = path.join(tmpDir, file)
      archive.file(filePath, { name: file })
    }

    await archive.finalize()
    await new Promise((resolve) => output.on('close', resolve))

    const zipBuffer = await fs.readFile(zipPath)

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=backup-data.zip'
      }
    })
  } catch (err) {
    console.error('Backup gagal:', err)
    return NextResponse.json({ error: 'Backup gagal atau folder tidak ditemukan' }, { status: 500 })
  }
}
