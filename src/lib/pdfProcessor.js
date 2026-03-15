import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker. Using unpkg ensures compatibility without complex build steps in this environment.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

/**
 * Extracts text and metadata from a PDF file
 * @param {File} file - The PDF file object
 * @returns {Promise<{text: string, type: string, date: string, rawDate: Date}>}
 */
export const processPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    // Analyze extracted text
    const analysis = analyzeDocument(fullText);

    return {
      text: fullText,
      ...analysis
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error("Falha ao ler o arquivo PDF. Verifique se o arquivo não está corrompido.");
  }
};

/**
 * Analyzes document text to find type and date
 */
const analyzeDocument = (text) => {
  const normalizedText = text.toLowerCase();
  
  // 1. Identify Document Type
  let type = "Documento Diverso";
  const typeKeywords = {
    "Sentença": ["sentença", "julgo procedente", "julgo improcedente", "dispositivo"],
    "Despacho": ["despacho", "intime-se", "cite-se", "conclusão"],
    "Decisão Interlocutória": ["decisão", "tutela de urgência", "liminar"],
    "Petição Inicial": ["petição inicial", "dos fatos", "dos pedidos"],
    "Contestação": ["contestação", "preliminarmente"],
    "Recurso": ["apelação", "agravo", "recurso inominado"],
    "Certidão": ["certidão", "certifico e dou fé"],
    "Audiência": ["termo de audiência", "ata de audiência"]
  };

  for (const [docType, keywords] of Object.entries(typeKeywords)) {
    if (keywords.some(k => normalizedText.includes(k))) {
      type = docType;
      break; // Stop at first match (priority order matters)
    }
  }

  // 2. Extract Date (simple heuristic looking for date patterns)
  // Look for patterns like "26 de Janeiro de 2026", "26/01/2026", etc.
  // We prioritize dates near the top or bottom of the document usually, but scanning all for now.
  const dateRegexes = [
    /\b\d{2}\/\d{2}\/\d{4}\b/, // DD/MM/YYYY
    /\b\d{2}\s+de\s+[a-zç]+\s+de\s+\d{4}\b/i // DD de Mes de YYYY
  ];

  let extractedDate = new Date().toLocaleDateString('pt-BR'); // Default to today
  
  for (const regex of dateRegexes) {
    const match = text.match(regex);
    if (match) {
      extractedDate = match[0];
      break;
    }
  }

  return {
    type,
    date: extractedDate,
    rawDate: new Date() // Placeholder, ideally parsed from extractedDate
  };
};