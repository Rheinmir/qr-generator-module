import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { BatchProgress } from '../utils/batchProcessor';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  progress: BatchProgress;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileSelect, isProcessing, progress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
       validateAndPass(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPass(e.target.files[0]);
    }
  };

  const validateAndPass = (file: File) => {
    // Simple extension check
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert("Vui lòng chỉ tải lên file Excel (.xlsx, .xls)");
      return;
    }
    onFileSelect(file);
    // Reset value so we can select same file again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
        ${isDragOver ? 'border-black bg-gray-50' : 'border-gray-200'}
        ${isProcessing ? 'pointer-events-none opacity-80' : 'cursor-pointer hover:border-black hover:bg-gray-50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
          <div className="space-y-1">
             <p className="text-sm font-medium">Đang xử lý: {progress.status}</p>
             <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-black transition-all duration-300" 
                 style={{ width: `${(progress.current / Math.max(progress.total, 1)) * 100}%` }}
               />
             </div>
             <p className="text-xs text-gray-500">{progress.current} / {progress.total}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 text-[#86868b]">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-black">Kéo thả file Excel vào đây</p>
            <p className="text-xs mt-1">hoặc nhấn để tải lên</p>
          </div>
          <p className="text-[10px] uppercase tracking-wide pt-2">Hỗ trợ .xlsx</p>
        </div>
      )}
    </div>
  );
};
