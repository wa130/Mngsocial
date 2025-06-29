import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function GET() {
  const tmpDir = path.join(process.cwd(), '/tmp')
  const zipPath = path.join(process.cwd(), 'tmp', 'backup.zip')

  try {
    // Pastikan folder //tmp ada
    await fs.access(tmpDir)

    // Buat file stream zip
    const output = fsSync.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    archive.pipe(output)

    // Tambahkan semua file di dalam /tmp
    const files = await fs.readdir(tmpDir)
    for (const file of files) {
      const filePath = path.join(tmpDir, file)
      archive.file(filePath, { name: file })
    }

    await archive.finalize()

    // Tunggu hingga file zip selesai dibuat
    await new Promise<void>((resolve) => {
      output.on('close', () => resolve())
    })

    // Baca hasil zip dan kirim sebagai response
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
