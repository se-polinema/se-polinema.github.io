// Client-side image resize/re-encode before upload to Supabase Storage.
// Matches the site's existing manual convention for member photos (~683px
// wide JPEG, quality ~82) — see the provenance comments in
// supabase/migrations/009_add_alumni_solikhin.sql /
// 011_add_alumni_batch.sql — but performed automatically in the browser
// instead of by hand before each commit. Re-encoding through <canvas>
// strips EXIF metadata as a side effect, matching that same convention.
//
// Zero new dependency: uses only the browser's native Image + Canvas APIs.

export class ImageResizeError extends Error {}

export async function resizeImageForUpload(
  file: File,
  maxWidth = 683,
  quality = 0.82
): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new ImageResizeError('That file is not an image.')
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const img = await loadImage(objectUrl)

    // Never upscale a source narrower than the target.
    const targetWidth = Math.min(img.naturalWidth, maxWidth)
    const targetHeight = Math.round((img.naturalHeight / img.naturalWidth) * targetWidth)

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new ImageResizeError("Couldn't process this image. Please try a different file.")
    }
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', quality)
    })

    if (!blob) {
      throw new ImageResizeError("Couldn't process this image. Please try a different file (JPEG or PNG).")
    }

    return blob
  } catch (err) {
    if (err instanceof ImageResizeError) throw err
    throw new ImageResizeError("Couldn't process this image. Please try a different file (JPEG or PNG).")
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new ImageResizeError("Couldn't read this image file."))
    img.src = src
  })
}
