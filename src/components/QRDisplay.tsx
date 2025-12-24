import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link } from 'lucide-react';
import Barcode from 'react-barcode';
import type { QROptions } from '../types';

interface QRDisplayProps {
  value: string;
  options: QROptions;
  onShowToast: (msg: string) => void;
  mode?: 'qr' | 'barcode';
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ value, options, onShowToast, mode = 'qr' }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const qrValue = value;


  const downloadQR = () => {
    // Handling download for both SVG (Barcode) and Canvas (QR)
    const container = qrRef.current;
    if (!container) return;

    if (mode === 'qr') {
      const canvas = container.querySelector('canvas');
      if (!canvas) return;
      
      const link = document.createElement('a');
      link.download = 'QR_Minimal.png';
      link.href = canvas.toDataURL();
      link.click();
      onShowToast("Đã lưu mã QR vào máy");
    } else {
      // Barcode is SVG, convert to PNG or download SVG? SVG is easier to download directly or just let user know.
      // For simplicity, let's try to convert SVG to canvas or just download SVG text.
      // But standard way for images:
      const svg = container.querySelector('svg');
      if (!svg) return;
      
      const xml = new XMLSerializer().serializeToString(svg);
      const svg64 = btoa(xml);
      const b64Start = 'data:image/svg+xml;base64,';
      const image64 = b64Start + svg64;
      
      const link = document.createElement('a');
      link.download = 'Barcode.svg';
      link.href = image64;
      link.click();
       onShowToast("Đã lưu Barcode (SVG) vào máy");
    }
  };

  const copyToClipboard = () => {
    if (!qrValue.trim()) {
      onShowToast("Dữ liệu trống");
      return;
    }
    navigator.clipboard.writeText(qrValue)
      .then(() => onShowToast("Đã sao chép nội dung văn bản"))
      .catch(() => onShowToast("Lỗi khi sao chép"));
  };

  return (
    <div className="space-y-6">
      <div className="mac-card p-8 shadow-xl flex flex-col items-center justify-center transition-all hover:shadow-2xl">
        <div ref={qrRef} className="p-3 bg-white rounded-2xl shadow-inner border border-gray-100 flex items-center justify-center min-h-[180px] min-w-[180px]">
          {qrValue ? (
             mode === 'qr' ? (
              <QRCodeCanvas
                value={qrValue}
                size={180}
                level={"M"}
                fgColor={options.colorDark}
                bgColor={options.colorLight}
              />
            ) : (
               <Barcode 
                 value={qrValue} 
                 width={2}
                 height={100}
                 displayValue={true}
                 background={options.colorLight}
                 lineColor={options.colorDark}
               />
            )
          ) : (
            <span className="text-gray-300 text-sm">Chưa có dữ liệu</span>
          )}
        </div>
        <div className="mt-6 w-full">
          <div className="text-[10px] font-mono text-center text-[#86868b] leading-relaxed break-all bg-gray-50/50 p-3 rounded-lg border border-gray-100/50 min-h-[3em]">
            {qrValue || "Chưa có dữ liệu"}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={downloadQR}
          className="w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-[#333] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center"
        >
          <Download className="w-4 h-4 mr-2" /> Lưu ảnh
        </button>
        <button
          onClick={copyToClipboard}
          className="w-full bg-white text-black py-4 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center"
        >
          <Link className="w-3 h-3 mr-2" /> Sao chép văn bản
        </button>
      </div>
    </div>
  );
};
