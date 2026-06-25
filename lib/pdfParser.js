export async function extractTextFromPDF(pdfData) {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    return fullText;
  } catch (error) {
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
}
