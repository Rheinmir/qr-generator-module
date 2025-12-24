import React, { useState } from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { Layout } from './components/Layout';
import { FieldInput } from './components/FieldInput';
import { QRDisplay } from './components/QRDisplay';
import { Toast } from './components/Toast';
import { DropZone } from './components/DropZone';
import { useLocalStorage } from './hooks/useLocalStorage';
import { processBatchFile, processBatchFileToExcel, type BatchProgress } from './utils/batchProcessor';
import type { Field, QROptions } from './types';

const App: React.FC = () => {
  // State
  const [fields, setFields] = useLocalStorage<Field[]>('qr-fields', [
    { id: 1, key: 'ID', value: '1024' },
    { id: 2, key: 'NAME', value: 'Alex Nguyen' },
    { id: 3, key: 'DEPT', value: 'Product Design' }
  ]);
  
  const [qrOptions, setQrOptions] = useLocalStorage<QROptions>('qr-options', {
    colorDark: '#000000',
    colorLight: '#ffffff'
  });

  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false });
  
  // Batch Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<BatchProgress>({ total: 0, current: 0, status: 'parsing' });

  // Tab State
  const [activeTab, setActiveTab] = useState<'manual' | 'batch'>('manual');
  
  // Manual Sub-mode State
  const [manualMode, setManualMode] = useState<'structured' | 'plaintext'>('structured');
  const [plainText, setPlainText] = useLocalStorage<string>('qr-plaintext', '');

  // New Modes
  const [generatorMode, setGeneratorMode] = useState<'qr' | 'barcode'>('qr');
  const [batchOutputMode, setBatchOutputMode] = useState<'zip' | 'excel'>('zip');

  // Computed value for QR Display
  const qrValue = activeTab === 'manual' 
    ? (manualMode === 'structured' 
        ? fields.map(f => `${f.key}: ${f.value}`).join('\n') 
        : plainText
      )
    : ''; // In batch mode, we don't show a specific QR in preview, or we could show a placeholder.

  // Handlers
  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const addField = () => {
    setFields([...fields, { id: Date.now(), key: 'NEW', value: '' }]);
  };

  const removeField = (id: number) => {
    if (fields.length <= 1) {
      showToast("Phải giữ lại ít nhất 1 trường");
      return;
    }
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: number, key: keyof Field, value: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const resetApp = () => {
    if (manualMode === 'structured') {
      setFields([{ id: Date.now(), key: 'ID', value: '' }]);
    } else {
      setPlainText('');
    }
    showToast("Đã làm mới dữ liệu");
  };

  const handleBatchFile = async (file: File) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (batchOutputMode === 'zip') {
        await processBatchFile(file, qrOptions, (p) => setProgress(p));
        showToast("Tạo ZIP thành công! File đã được tải xuống.");
      } else {
        await processBatchFileToExcel(file, qrOptions, (p) => setProgress(p));
        showToast("Xuất Excel thành công! File đã được tải xuống.");
      }
    } catch (error) {
      console.error(error);
      showToast("Có lỗi xảy ra khi xử lý file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Input Section */}
        {/* Input Section */}
        <div className="lg:col-span-3 space-y-6 relative">
          
          {/* Sidebar Generator Mode Switcher */}
          <div className="absolute -left-16 top-0 hidden xl:flex flex-col gap-2 group">
             <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors cursor-pointer relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity" />
                <span className="text-xs font-bold">MODE</span>
             </div>
             
             <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 -translate-x-2 group-hover:translate-x-0 duration-300">
               <button 
                 onClick={() => setGeneratorMode('qr')}
                 className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-all ${generatorMode === 'qr' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black'}`}
                 title="QR Code"
               >
                 QR
               </button>
               <button 
                 onClick={() => setGeneratorMode('barcode')}
                 className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border transition-all ${generatorMode === 'barcode' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-black'}`}
                 title="Barcode"
               >
                 Bar
               </button>
             </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100/50 p-1 rounded-xl">
             <button 
               onClick={() => setActiveTab('manual')}
               className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'manual' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Tạo Thủ Công
             </button>
             <button 
               onClick={() => setActiveTab('batch')}
               className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'batch' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
               Tạo Hàng Loạt
             </button>
          </div>

          {/* Manual Input Mode */}
          {activeTab === 'manual' && (
            <div className="mac-card p-6 shadow-sm flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Sub-mode Switcher */}
              <div className="flex items-center gap-4 border-b border-gray-100 pb-2 mb-2">
                 <button 
                   onClick={() => setManualMode('structured')}
                   className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors ${manualMode === 'structured' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                 >
                   Cấu trúc (Key-Value)
                 </button>
                 <button 
                   onClick={() => setManualMode('plaintext')}
                   className={`text-xs font-semibold uppercase tracking-wider pb-2 border-b-2 transition-colors ${manualMode === 'plaintext' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                 >
                   Văn bản (Plain Text)
                 </button>
                 <div className="flex-1" />
                 <button onClick={resetApp} className="text-xs text-blue-600 hover:underline">Xóa tất cả</button>
              </div>

              {manualMode === 'structured' ? (
                <>
                  <div className="max-h-[400px] overflow-y-auto pr-1 space-y-3">
                    {fields.map(field => (
                      <FieldInput 
                        key={field.id} 
                        field={field} 
                        onUpdate={updateField} 
                        onRemove={removeField} 
                      />
                    ))}
                  </div>

                  <button 
                    onClick={addField} 
                    className="group flex items-center justify-center w-full py-4 rounded-xl border border-dashed border-gray-200 hover:border-black transition-all duration-300 text-sm text-[#86868b] hover:text-black mt-2"
                  >
                    <Plus className="w-3 h-3 mr-2 transition-transform group-hover:rotate-90" />
                    Thêm trường dữ liệu mới
                  </button>
                </>
              ) : (
                <textarea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Nhập nội dung văn bản tại đây..."
                  className="w-full h-[300px] p-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 resize-none text-sm font-mono text-gray-700 bg-gray-50/50"
                />
              )}
            </div>
          )}

          {/* Batch Export Mode */}
          {activeTab === 'batch' && (
            <div className="mac-card p-6 shadow-sm flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="px-1 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#86868b]">Tạo hàng loạt (Batch)</span>
                  
                  {/* Output Mode Toggle */}
                  <div className="flex bg-gray-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => setBatchOutputMode('zip')}
                      className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${batchOutputMode === 'zip' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
                    >
                      ZIP (Ảnh)
                    </button>
                    <button
                      onClick={() => setBatchOutputMode('excel')}
                      className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${batchOutputMode === 'excel' ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}
                    >
                      Excel (Kèm QR)
                    </button>
                  </div>
               </div>
               <DropZone 
                 onFileSelect={handleBatchFile} 
                 isProcessing={isProcessing}
                 progress={progress}
               />
               
               {/* Batch Actions & Guide */}
               <div className="flex flex-col gap-3 pt-2">
                  <button 
                    onClick={() => import('./utils/batchProcessor').then(m => m.downloadTemplate())}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Tải file Excel mẫu
                  </button>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-xs text-[#86868b] space-y-2 border border-gray-100">
                    <p className="font-semibold text-gray-900 mb-1">Hướng dẫn sử dụng:</p>
                    <ul className="list-disc list-inside space-y-1 ml-1">
                      <li>Modes: <strong>ZIP</strong> (tải bộ ảnh) hoặc <strong>Excel</strong> (tải file Excel có chèn ảnh QR).</li>
                      <li>Dòng 1 của file Excel là <strong>Tên trường</strong>.</li>
                      <li>Hệ thống sẽ tạo 1 mã cho mỗi dòng.</li>
                    </ul>
                  </div>
               </div>
            </div>
          )}

          {/* Shared Options Section */}
          <div className="mac-card p-4 shadow-sm">
             <details className="text-xs text-[#86868b]">
               <summary className="cursor-pointer font-medium hover:text-black transition-colors flex items-center justify-between">
                 <span>Tùy chỉnh giao diện (Màu sắc)</span>
                 <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400">Dùng cho cả 2 chế độ</span>
               </summary>
               <div className="mt-3 grid grid-cols-2 gap-4">
                 <label className="flex flex-col gap-1">
                   <span>Màu QR</span>
                   <input 
                     type="color" 
                     value={qrOptions.colorDark}
                     onChange={(e) => setQrOptions({...qrOptions, colorDark: e.target.value})}
                     className="w-full h-8 rounded cursor-pointer"
                   />
                 </label>
                 <label className="flex flex-col gap-1">
                   <span>Màu nền</span>
                    <input 
                     type="color" 
                     value={qrOptions.colorLight}
                     onChange={(e) => setQrOptions({...qrOptions, colorLight: e.target.value})}
                     className="w-full h-8 rounded cursor-pointer"
                   />
                 </label>
               </div>
             </details>
          </div>

        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2">
           <QRDisplay 
             value={qrValue}
             options={qrOptions}
             onShowToast={showToast}
             mode={generatorMode}
           />
        </div>
      </div>

      <Toast 
        message={toast.msg} 
        isVisible={toast.visible} 
        onClose={closeToast} 
      />
    </Layout>
  );
};

export default App;
