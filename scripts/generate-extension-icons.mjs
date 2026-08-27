import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdir } from 'node:fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOURCE_SVG = path.resolve(__dirname, '../public/favicon.svg')
const OUTPUT_DIR = path.resolve(__dirname, '../public/extension/icons')

export const ICON_SIZES = [16, 48, 128]

export async function generateIcons() {
  await mkdir(OUTPUT_DIR, { recursive: true })
  await Promise.all(
    ICON_SIZES.map((size) =>
      sharp(SOURCE_SVG, { density: 384 })
        .resize(size, size)
        .png()
        .toFile(path.join(OUTPUT_DIR, `icon-${size}.png`)),
    ),
  )
  return OUTPUT_DIR
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await generateIcons()
  console.log('Generated extension icons at', OUTPUT_DIR)
}
