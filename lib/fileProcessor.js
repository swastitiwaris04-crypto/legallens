import { AppError } from '@/lib/errors'

export async function extractTextFromPDF(buffer) {
  try {
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    throw new AppError('Failed to extract text from PDF: ' + error.message, 422, 'PDF_PARSE_ERROR')
  }
}

export async function extractTextFromImage(buffer) {
  try {
    const sharp = (await import('sharp'))
    const Tesseract = (await import('tesseract.js'))

    const processed = await sharp(buffer)
      .grayscale()
      .normalise()
      .toBuffer()

    const { data } = await Tesseract.recognize(processed, 'eng+hin', {
      logger: () => {},
    })
    return data.text
  } catch (error) {
    throw new AppError('Failed to extract text from image: ' + error.message, 422, 'OCR_ERROR')
  }
}

export async function processFile(buffer, mimeType) {
  if (mimeType === 'application/pdf') {
    return await extractTextFromPDF(buffer)
  }
  if (mimeType.startsWith('image/')) {
    return await extractTextFromImage(buffer)
  }
  throw new AppError('Unsupported file type. Only PDF and images are accepted.', 400, 'INVALID_FILE_TYPE')
}

export function getFileType(mimeType) {
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.startsWith('image/')) return 'image'
  return 'text'
}
