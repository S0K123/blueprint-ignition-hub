export type ParsedPdf = {
  text: string;
  pageCount: number;
};

import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import * as Tesseract from 'tesseract.js';

// Set worker source using CDN fallback for better reliability
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

export async function parsePdfFile(file: File): Promise<ParsedPdf> {
  try {
    
    const data = await file.arrayBuffer();
    
    // Validate file is actually a PDF
    if (data.byteLength < 4) {
      throw new Error("File is too small to be a valid PDF");
    }
    
    const pdf = await getDocument({ data }).promise;

    if (!pdf.numPages || pdf.numPages < 1) {
      throw new Error("PDF appears to be empty or corrupted");
    }

    console.log(`PDF loaded: ${pdf.numPages} pages, file size: ${(data.byteLength / 1024 / 1024).toFixed(2)}MB`);

    const pages: string[] = [];
    let totalTextItems = 0;
    let imageBasedPages = 0;
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        
        // Try multiple text extraction strategies
        let pageText = "";
        
        // Strategy 1: Standard text content extraction
        try {
          const content = await page.getTextContent();
          const textItems = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .filter(text => text.trim().length > 0);
          
          totalTextItems += textItems.length;
          pageText = textItems
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
            
          console.log(`Page ${pageNum}: ${textItems.length} text items, "${pageText.substring(0, 100)}..."`);
        } catch (textError) {
          console.warn(`Standard text extraction failed for page ${pageNum}:`, textError);
        }
        
        // Strategy 2: Enhanced text extraction with marked content
        if (!pageText || pageText.length < 50) {
          try {
            const content = await page.getTextContent({ 
              includeMarkedContent: true
            });
            const enhancedText = content.items
              .map((item) => ("str" in item ? item.str : ""))
              .filter(text => text.trim().length > 0)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim();
            
            if (enhancedText.length > pageText.length) {
              pageText = enhancedText;
              console.log(`Page ${pageNum}: Enhanced extraction found ${enhancedText.length} chars`);
            }
          } catch (enhancedError) {
            console.warn(`Enhanced text extraction failed for page ${pageNum}:`, enhancedError);
          }
        }
        
        // Strategy 3: OCR for image-based PDFs
        if (!pageText || pageText.length < 50) {
          try {
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              throw new Error('Could not get canvas context');
            }
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({ canvasContext: context, viewport, canvas }).promise;
            
            // Use Tesseract.js for OCR
            console.log(`Starting OCR for page ${pageNum}...`);
            
            const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
              logger: (m: any) => {
                if (m.status === 'recognizing text') {
                  console.log(`OCR Page ${pageNum}: ${Math.round(m.progress * 100)}%`);
                }
              }
            });
            
            if (text && text.trim().length > 50) {
              pageText = text.trim();
              console.log(`Page ${pageNum}: OCR extracted ${pageText.length} chars`);
            } else {
              console.warn(`Page ${pageNum}: OCR extracted insufficient text (${text?.length || 0} chars)`);
            }
          } catch (ocrError) {
            console.warn(`OCR failed for page ${pageNum}:`, ocrError);
          }
        }
        
        // Strategy 4: Fallback - extract any visible text from page structure
        if (!pageText || pageText.length < 20) {
          try {
            // Get page text structure as last resort
            const textContent = await page.getTextContent();
            const structuredText = textContent.items
              .map((item: any) => {
                if (item.str) return item.str;
                if (item.items) {
                  return item.items.map((subItem: any) => subItem.str || '').join('');
                }
                return '';
              })
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (structuredText.length > 10) {
              pageText = structuredText;
              console.log(`Page ${pageNum}: Structure fallback extracted ${pageText.length} chars`);
            }
          } catch (structureError) {
            console.warn(`Structure fallback failed for page ${pageNum}:`, structureError);
          }
        }
        
        // Validate extracted text
        if (pageText && pageText.length > 10) {
          // Clean up the text
          pageText = pageText
            .replace(/[^\w\s\-\.\,\;\:\!\?\(\)\[\]\{\}"'\/\\@#\$%\^&\*\+\=\|\<\>\~`]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/(\w)([A-Z])/g, '$1 $2') // Split camelCase
            .trim();
          
          if (pageText.length > 20) {
            pages.push(pageText);
            console.log(`Page ${pageNum}: Successfully extracted ${pageText.length} characters`);
          } else {
            console.warn(`Page ${pageNum}: Extracted text too short (${pageText.length} chars)`);
            imageBasedPages++;
          }
        } else {
          console.warn(`Page ${pageNum}: No meaningful text extracted (likely image-based)`);
          imageBasedPages++;
        }
        
      } catch (pageError) {
        console.warn(`Failed to parse page ${pageNum}:`, pageError);
        imageBasedPages++;
        continue;
      }
    }

    console.log(`Extraction complete: ${pages.length}/${pdf.numPages} pages with text, ${totalTextItems} total text items, ${imageBasedPages} image-based pages`);

    // If we have some text but not much, try to combine what we have
    if (pages.length > 0 && pages.length < pdf.numPages / 2) {
      const combinedText = pages.join('\n\n');
      if (combinedText.length > 500) {
        console.log(`Using partial extraction: ${combinedText.length} characters from ${pages.length} pages`);
        return {
          text: combinedText,
          pageCount: pdf.numPages,
        };
      }
    }

    if (pages.length === 0) {
      // Provide comprehensive error message with solutions
      let errorMsg = "Unable to extract text from this PDF. ";
      
      if (imageBasedPages === pdf.numPages) {
        errorMsg += "This appears to be a scanned/image-based PDF. OCR was attempted but failed to extract meaningful text. Solutions:\n";
        errorMsg += "1. Try a higher quality PDF with better resolution\n";
        errorMsg += "2. Use a PDF with selectable text (recommended)\n";
        errorMsg += "3. Convert the PDF using a professional OCR tool like Adobe Acrobat\n";
        errorMsg += "4. Check if the PDF contains actual text content (not just images)";
      } else if (totalTextItems > 0) {
        errorMsg += "Text fragments were found but couldn't be combined properly. This PDF may have complex formatting or encryption.";
      } else {
        errorMsg += "The PDF may be corrupted, password-protected, or in an unsupported format.";
      }
      
      throw new Error(errorMsg);
    }

    return {
      text: pages.join("\n\n"),
      pageCount: pdf.numPages,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context if it's already a meaningful error
      throw error;
    }
    throw new Error(`PDF parsing failed: ${String(error)}`);
  }
}
