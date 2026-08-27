import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import path from 'node:path'
import { generateIcons, ICON_SIZES } from './generate-extension-icons.mjs'

describe('generateIcons', () => {
  it('writes a correctly sized PNG for each icon size', async () => {
    const outputDir = await generateIcons()
    for (const size of ICON_SIZES) {
      const metadata = await sharp(path.join(outputDir, `icon-${size}.png`)).metadata()
      expect(metadata.width).toBe(size)
      expect(metadata.height).toBe(size)
      expect(metadata.format).toBe('png')
    }
  })
})
