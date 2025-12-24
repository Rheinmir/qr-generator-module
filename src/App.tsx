import React, { useState } from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { Layout } from './components/Layout';
import { FieldInput } from './components/FieldInput';
import { QRDisplay } from './components/QRDisplay';
import { Toast } from './components/Toast';
import { DropZone } from './components/DropZone';
import { useLocalStorage } from './hooks/useLocalStorage';
import { processBatchFile, type BatchProgress } from './utils/batchProcessor';
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
    setFields([{ id: Date.now(), key: 'ID', value: '' }]);
    showToast("Đã làm mới dữ liệu");
  };

  const handleBatchFile = async (file: File) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await processBatchFile(file, qrOptions, (p) => {
        setProgress(p);
      });
      showToast("Tạo hàng loạt thành công! File đã được tải xuống.");
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
        <div className="lg:col-span-3 space-y-6">
          
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
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#86868b]">Cấu trúc thẻ</span>
                <button onClick={resetApp} className="text-xs text-blue-600 hover:underline">Xóa tất cả</button>
              </div>

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
            </div>
          )}

          {/* Batch Export Mode */}
          {activeTab === 'batch' && (
            <div className="mac-card p-6 shadow-sm flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="px-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#86868b]">Tạo hàng loạt (Batch)</span>
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
                      <li>Dòng 1 của file Excel là <strong>Tên trường</strong> (VD: Tên, ID).</li>
                      <li>Các dòng tiếp theo là <strong>Dữ liệu</strong>.</li>
                      <li>Hệ thống sẽ tạo 1 file ảnh QR cho mỗi dòng.</li>
                      <li>Tên file được đặt tự động dựa trên nội dung.</li>
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
             fields={fields} 
             options={qrOptions}
             onShowToast={showToast}
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
