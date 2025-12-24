import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link } from 'lucide-react';
import type { Field, QROptions } from '../types';

interface QRDisplayProps {
  fields: Field[];
  options: QROptions;
  onShowToast: (msg: string) => void;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ fields, options, onShowToast }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const qrValue = fields.map(f => `${f.key}: ${f.value}`).join('\n');


  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      onShowToast("Không có mã QR để tải");
      return;
    }
    const link = document.createElement('a');
    link.download = 'QR_Minimal.png';
    link.href = canvas.toDataURL();
    link.click();
    onShowToast("Đã lưu mã QR vào máy");
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
          {qrValue && (
            <QRCodeCanvas
              value={qrValue}
              size={180}
              level={"M"}
              fgColor={options.colorDark}
              bgColor={options.colorLight}
            />
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
          <Download className="w-4 h-4 mr-2" /> Lưu ảnh QR
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
