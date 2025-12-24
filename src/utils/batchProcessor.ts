import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import type { QROptions } from '../types';

export interface BatchProgress {
  total: number;
  current: number;
  status: 'parsing' | 'generating' | 'zipping' | 'completed' | 'error';
  errorMessage?: string;
}

export const processBatchFile = async (
  file: File, 
  options: QROptions,
  onProgress: (progress: BatchProgress) => void
): Promise<void> => {
  try {
    // 1. Parse Excel
    onProgress({ total: 0, current: 0, status: 'parsing' });
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Get headers to ensure we process correctly
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });
    
    if (jsonData.length === 0) {
      throw new Error("File Excel trống hoặc không đúng định dạng");
    }

    // 2. Setup ZIP
    const zip = new JSZip();
    const total = jsonData.length;
    
    // 3. Generate QRs
    onProgress({ total, current: 0, status: 'generating' });

    for (let i = 0; i < total; i++) {
      const row = jsonData[i];
      // Convert row to Key-Value string
      const qrText = Object.entries(row)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join('\n');
        
      if (!qrText.trim()) continue;

      // Generate QR Buffer
      // We use dataURL then strip preamble to get base64 for JSZip
      const dataUrl = await QRCode.toDataURL(qrText, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 500,
        color: {
          dark: options.colorDark,
          light: options.colorLight
        }
      });
      
      const base64Data = dataUrl.split(',')[1];
      
      // Filename: Join all values with ' - '
      const rawFilename = Object.values(row)
        .map(val => String(val).trim())
        .filter(val => val.length > 0)
        .join(' - ');
      
      // Sanitize filename (allow unicode for Vietnamese, replace illegal chars)
      // Removing: / \ : * ? " < > |
      const safeName = rawFilename.replace(/[<>:"/\\|?*]/g, '_').trim() || `qr_code_${(i + 1).toString().padStart(3, '0')}`;
        
      zip.file(`${safeName}.png`, base64Data, { base64: true });
      
      // Report progress every 5 items or last one to avoid UI thrashing
      if (i % 5 === 0 || i === total - 1) {
        onProgress({ total, current: i + 1, status: 'generating' });
      }
      
      // Small yield to let UI breathe
      await new Promise(r => setTimeout(r, 0)); 
    }

    // 4. Zip and Download
    onProgress({ total, current: total, status: 'zipping' });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `QR_Batch_${new Date().getTime()}.zip`);
    
    onProgress({ total, current: total, status: 'completed' });

  } catch (error) {
    console.error(error);
    onProgress({ total: 0, current: 0, status: 'error', errorMessage: error instanceof Error ? error.message : "Lỗi không xác định" });
  }
};
