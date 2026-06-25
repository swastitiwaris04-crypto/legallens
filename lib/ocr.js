export async function extractTextFromImage(imageData) {
  try {
    const Tesseract = await import('tesseract.js');
    const { data } = await Tesseract.recognize(imageData, 'eng+hin');
    return data.text;
  } catch (error) {
    throw new Error('Failed to extract text from image: ' + error.message);
  }
}
