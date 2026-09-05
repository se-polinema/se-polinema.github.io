import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'

const researcherAssets = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/researchers/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
)

export interface ResearcherImage {
  src: string
  srcset: string
  sizes: string
  width: number
  height: number
  srcLarge?: string
}

export interface ResearcherImageOptions {
  widths?: number[]
  sizes?: string
  defaultWidth?: number
  largeWidth?: number
}

const AVATAR_WIDTHS = [64, 96, 128, 192, 256, 320]
const PROFILE_WIDTHS = [160, 320, 480]
const DEFAULT_SIZES = '(max-width: 768px) 160px, 320px'

export async function getResearcherImage(
  id: string,
  options: ResearcherImageOptions = {},
): Promise<ResearcherImage | null> {
  const asset = findAsset(id)
  if (!asset) return null

  const {
    widths = PROFILE_WIDTHS,
    sizes = DEFAULT_SIZES,
    defaultWidth = 320,
    largeWidth,
  } = options

  const defaultW = Math.min(defaultWidth, asset.width)
  const usableWidths = widths.filter((w) => w < asset.width)

  const result = await getImage({
    src: asset,
    width: defaultW,
    widths: usableWidths.length > 0 ? usableWidths : [asset.width],
    format: 'webp',
  })

  const output: ResearcherImage = {
    src: result.src,
    srcset: result.srcSet.attribute,
    sizes,
    width: Number(result.attributes.width),
    height: Number(result.attributes.height),
  }

  if (largeWidth && largeWidth !== defaultW) {
    const largeW = Math.min(largeWidth, asset.width)
    const large = await getImage({ src: asset, width: largeW, format: 'webp' })
    output.srcLarge = large.src
  }

  return output
}

export async function getResearcherAvatar(
  id: string,
  sizes = '96px',
): Promise<ResearcherImage | null> {
  return getResearcherImage(id, {
    widths: AVATAR_WIDTHS,
    sizes,
    defaultWidth: 96,
  })
}

export interface OptimizedImageProps {
  src: string
  srcset: string
  sizes: string
  width: number
  height: number
}

export function toOptimizedImageProps(
  image: ResearcherImage | null,
): OptimizedImageProps | null {
  if (!image) return null
  return {
    src: image.src,
    srcset: image.srcset,
    sizes: image.sizes,
    width: image.width,
    height: image.height,
  }
}

function findAsset(id: string): ImageMetadata | undefined {
  for (const [path, mod] of Object.entries(researcherAssets)) {
    const base = (path.split('/').pop() ?? '').replace(/\.[^.]+$/, '')
    if (base === id) return mod.default
  }
  return undefined
}
