import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import QRCode from 'qrcode';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import JsBarcode from 'jsbarcode';
import type { QROptions } from '../types';

export interface BatchProgress {
  total: number;
  current: number;
  status: 'parsing' | 'generating' | 'zipping' | 'exporting' | 'completed' | 'error';
  errorMessage?: string;
}

const generateBarcodeDataUrl = (text: string, options: QROptions, displayText?: string): string => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, text, {
        format: "CODE128",
        lineColor: options.colorDark,
        background: options.colorLight,
        displayValue: true,
        text: displayText, // Override display text if provided
        width: 2,
        height: 100,
        margin: 10,
        fontSize: 14 // Readable font size
    });
    return canvas.toDataURL("image/png");
};

export const processBatchFileToExcel = async (
    file: File, 
    options: QROptions,
    mode: 'qr' | 'barcode',
    onProgress: (progress: BatchProgress) => void
  ): Promise<void> => {
    try {
      // 1. Parsing Input
      onProgress({ total: 0, current: 0, status: 'parsing' });
      const arrayBuffer = await file.arrayBuffer();
      const workbookInput = XLSX.read(arrayBuffer);
      const firstSheetName = workbookInput.SheetNames[0];
      const worksheetInput = workbookInput.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheetInput, { defval: "" });
  
      if (jsonData.length === 0) throw new Error("File Excel trống");
  
      // 2. Setup Output Workbook (ExcelJS)
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(mode === 'qr' ? 'QR Codes' : 'Barcodes');
  
      // Add Headers
      const headers = Object.keys(jsonData[0]);
      worksheet.columns = [
        ...headers.map(key => ({ header: key, key: key, width: 20 })),
        { header: mode === 'qr' ? 'QR Code' : 'Barcode', key: 'code_image', width: mode === 'qr' ? 25 : 50 } 
      ];
  
      const total = jsonData.length;
      onProgress({ total, current: 0, status: 'generating' });
  
  // 3. Process Rows
      for (let i = 0; i < total; i++) {
        const row = jsonData[i];
   
        // Add row data
        const addedRow = worksheet.addRow({
          ...row,
          code_image: '' // Placeholder
        });
  
        // Generate Text
        // For Barcode in batch, we typically encode the VALUES.
        // And we display the KEYS + VALUES below for human readability.
        
        let encodedData = '';
        let displayText = '';

        if (mode === 'qr') {
             // For QR, we usually encode the full rich text
             encodedData = Object.entries(row).map(([k,v]) => `${k}: ${v}`).join('\n');
        } else {
             // For Barcode, we encode values only (joined by -)
             // Clean values to be safe for Code128 (ASCII)
             encodedData = Object.values(row)
                .map(v => String(v).trim())
                .filter(v => v)
                .join('-');
                
             // Display text: Key: Value | Key: Value
             displayText = Object.entries(row).map(([k,v]) => `${k}: ${v}`).join(' | ');
        }

        if (encodedData.trim()) {
          let dataUrl = '';

          if (mode === 'qr') {
             dataUrl = await QRCode.toDataURL(encodedData, {
                errorCorrectionLevel: 'M',
                margin: 1,
                width: 200, 
                color: {
                   dark: options.colorDark,
                   light: options.colorLight
                }
             });
          } else {
             dataUrl = generateBarcodeDataUrl(encodedData, options, displayText);
          }
          
          // Embed Image
          const imageId = workbook.addImage({
            base64: dataUrl,
            extension: 'png',
          });
  
          // Position Image in the last column
          worksheet.addImage(imageId, {
            tl: { col: headers.length, row: i + 1 }, // +1 for header
            ext: { width: mode === 'qr' ? 100 : 200, height: 100 },
            editAs: 'oneCell'
          });
  
          // Adjust Row Height
          addedRow.height = 80;
        }
  
        if (i % 5 === 0 || i === total - 1) {
          onProgress({ total, current: i + 1, status: 'generating' });
          await new Promise(r => setTimeout(r, 0));
        }
      }
  
      // 4. Export
      onProgress({ total, current: total, status: 'exporting' });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${mode === 'qr' ? 'QR' : 'Barcode'}_Batch_Excel_${new Date().getTime()}.xlsx`);
      
      onProgress({ total, current: total, status: 'completed' });
  
    } catch (error) {
      console.error(error);
      onProgress({ total: 0, current: 0, status: 'error', errorMessage: error instanceof Error ? error.message : "Error" });
    }
  };
  
export const processBatchFile = async (
  file: File, 
  options: QROptions,
  mode: 'qr' | 'barcode',
  onProgress: (progress: BatchProgress) => void
): Promise<void> => {
  try {
    // 1. Parse Excel
    onProgress({ total: 0, current: 0, status: 'parsing' });
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Get headers
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });
    
    if (jsonData.length === 0) {
      throw new Error("File Excel trống hoặc không đúng định dạng");
    }

    // 2. Setup ZIP
    const zip = new JSZip();
    const total = jsonData.length;
    
    // 3. Generate Codes
    onProgress({ total, current: 0, status: 'generating' });

    for (let i = 0; i < total; i++) {
      const row = jsonData[i];
      
      let encodedData = '';
      let displayText = '';

      if (mode === 'qr') {
           encodedData = Object.entries(row).map(([k,v]) => `${k}: ${v}`).join('\n');
      } else {
           encodedData = Object.values(row)
              .map(v => String(v).trim())
              .filter(v => v)
              .join('-');
           displayText = Object.entries(row).map(([k,v]) => `${k}: ${v}`).join(' | ');
      }
        
      if (!encodedData.trim()) continue;

      let dataUrl = '';
      if (mode === 'qr') {
          dataUrl = await QRCode.toDataURL(encodedData, {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 500,
            color: {
              dark: options.colorDark,
              light: options.colorLight
            }
          });
      } else {
          dataUrl = generateBarcodeDataUrl(encodedData, options, displayText);
      }
      
      const base64Data = dataUrl.split(',')[1];
      
      const rawFilename = Object.values(row)
        .map(val => String(val).trim())
        .filter(val => val.length > 0)
        .join(' - ');
      
      const safeName = rawFilename.replace(/[<>:"/\\|?*]/g, '_').trim() || `code_${(i + 1).toString().padStart(3, '0')}`;
        
      zip.file(`${safeName}.png`, base64Data, { base64: true });
      
      if (i % 5 === 0 || i === total - 1) {
        onProgress({ total, current: i + 1, status: 'generating' });
      }
      
      await new Promise(r => setTimeout(r, 0)); 
    }

    // 4. Zip and Download
    onProgress({ total, current: total, status: 'zipping' });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${mode === 'qr' ? 'QR' : 'Barcode'}_Batch_${new Date().getTime()}.zip`);
    
    onProgress({ total, current: total, status: 'completed' });

  } catch (error) {
    console.error(error);
    onProgress({ total: 0, current: 0, status: 'error', errorMessage: error instanceof Error ? error.message : "Lỗi không xác định" });
  }
};

export const downloadTemplate = () => {
    // ... same as before
    const ws = XLSX.utils.json_to_sheet([
        { 'ID': '001', 'Họ và Tên': 'Nguyen Van A', 'Phòng Ban': 'Kỹ Thuật', 'Chức Vụ': 'Nhân viên' },
        { 'ID': '002', 'Họ và Tên': 'Tran Thi B', 'Phòng Ban': 'Kế Toán', 'Chức Vụ': 'Trưởng phòng' },
        { 'ID': '003', 'Họ và Tên': 'Le Van C', 'Phòng Ban': 'Nhân Sự', 'Chức Vụ': 'Thực tập sinh' },
      ]);
      
      ws['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 }];
    
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      
      XLSX.writeFile(wb, "Batch_Template.xlsx");
};
