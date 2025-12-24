import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Layout } from './components/Layout';
import { FieldInput } from './components/FieldInput';
import { QRDisplay } from './components/QRDisplay';
import { Toast } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
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

  // Handlers
  const showToast = (msg: string) => {
    setToast({ msg, visible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const addField = () => {
    setFields([...fields, { id: Date.now(), key: 'NEW', value: '' }]);
    // Scroll handling is slightly harder in React efficiently without ref, 
    // but the user will likely scroll naturally or we can add a ref to the container.
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

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Input Section */}
        <div className="lg:col-span-3 mac-card p-6 shadow-sm flex flex-col space-y-4">
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
          
          {/* Options Section (New Feature) */}
          <div className="pt-4 border-t border-gray-100 mt-2">
             <details className="text-xs text-[#86868b]">
               <summary className="cursor-pointer font-medium hover:text-black transition-colors">Tùy chỉnh nâng cao</summary>
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
