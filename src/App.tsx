import React, { useState } from 'react';
import { Plus, FileSpreadsheet, Wifi, Smartphone, Mail, Globe, MapPin, Calendar, CreditCard, AlignLeft, Hash, Link as LinkIcon } from 'lucide-react';
import { Layout } from './components/Layout';
import { FieldInput } from './components/FieldInput';
import { QRDisplay } from './components/QRDisplay';
import { Toast } from './components/Toast';
import { DropZone } from './components/DropZone';
import { useLocalStorage } from './hooks/useLocalStorage';
import { processBatchFile, processBatchFileToExcel, type BatchProgress } from './utils/batchProcessor';
import { generateVietQR } from './utils/vietqr';
import type { Field, QROptions } from './types';
import { VIETQR_BANKS } from './constants/banks';

type ManualSubMode = 'structured' | 'plaintext' | 'wifi' | 'vcard' | 'url' | 'email' | 'event' | 'location' | 'vietqr' | 'app';

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
  const [manualMode, setManualMode] = useState<ManualSubMode>('structured');
  const [plainText, setPlainText] = useLocalStorage<string>('qr-plaintext', '');

  // Advanced QR States
  const [wifiData, setWifiData] = useState({ ssid: '', password: '', type: 'WPA', hidden: false });
  const [vCardData, setVCardData] = useState({ firstName: '', lastName: '', mobile: '', email: '', company: '', job: '', street: '', website: '' });
  const [urlData, setUrlData] = useState({ url: '', utmSource: '', utmMedium: '', utmCampaign: '' });
  const [emailData, setEmailData] = useState({ email: '', subject: '', body: '' });
  const [eventData, setEventData] = useState({ title: '', location: '', start: '', end: '', notes: '' });
  const [locData, setLocData] = useState({ lat: '', long: '' });
  const [appData, setAppData] = useState({ appScheme: '', fallback: '' });
  const [vietQrData, setVietQrData] = useState({ bankId: '', accountNo: '', amount: '', content: '' });

  // New Modes
  const [generatorMode, setGeneratorMode] = useState<'qr' | 'barcode'>('qr');
  const [batchOutputMode, setBatchOutputMode] = useState<'zip' | 'excel'>('zip');

  // Logic to Generate QR String based on Mode
  const generateQRString = (): string => {
    switch (manualMode) {
      case 'structured':
        return fields.map(f => `${f.key}: ${f.value}`).join('\n');
      case 'plaintext':
        return plainText;
      case 'wifi':
        // WIFI:S:ssid;T:WPA;P:password;H:false;;
        return `WIFI:S:${wifiData.ssid};T:${wifiData.type};P:${wifiData.password};H:${wifiData.hidden};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardData.lastName};${vCardData.firstName};;;\nFN:${vCardData.firstName} ${vCardData.lastName}\nORG:${vCardData.company}\nTITLE:${vCardData.job}\nTEL;TYPE=CELL:${vCardData.mobile}\nEMAIL:${vCardData.email}\nADR;TYPE=WORK:;;${vCardData.street};;;;\nURL:${vCardData.website}\nEND:VCARD`;
      case 'url':
        let finalUrl = urlData.url;
        if (urlData.utmSource || urlData.utmCampaign) {
            const params = new URLSearchParams();
            if (urlData.utmSource) params.append('utm_source', urlData.utmSource);
            if (urlData.utmMedium) params.append('utm_medium', urlData.utmMedium);
            if (urlData.utmCampaign) params.append('utm_campaign', urlData.utmCampaign);
            finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.toString();
        }
        return finalUrl;
      case 'email':
        return `mailto:${emailData.email}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      case 'event':
         // Simplified iCal
        return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${eventData.title}\nDTSTART:${eventData.start.replace(/[-:]/g, '')}\nDTEND:${eventData.end.replace(/[-:]/g, '')}\nLOCATION:${eventData.location}\nDESCRIPTION:${eventData.notes}\nEND:VEVENT\nEND:VCALENDAR`;
      case 'location':
        return `geo:${locData.lat},${locData.long}`;
      case 'app':
        // Universal Link logic is complex (https with apple-app-site-association), usually just URL.
        // But for Deep Link + Fallback, we can't do logic in QR. QR is static. 
        // We just encode the App Scheme OR the Fallback URL?
        // Usually deep link: myapp://path
        return appData.appScheme || appData.fallback;
      case 'vietqr':
        if (!vietQrData.bankId || !vietQrData.accountNo) return "";
        try {
            return generateVietQR({
                bankBin: vietQrData.bankId,
                accountNumber: vietQrData.accountNo,
                amount: vietQrData.amount,
                content: vietQrData.content
            });
        } catch(e) {
            console.error(e);
            return "";
        }
      default:
        return "";
    }
  };

  const qrValue = activeTab === 'manual' ? generateQRString() : ''; 


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
    <Layout titleMode={generatorMode}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Input Section */}
        {/* Input Section */}
        <div className="lg:col-span-3 space-y-6 relative">
          
          {/* Refined Sidebar Mode Switcher */}
          <div className="absolute -left-14 top-0 z-10 hidden xl:flex flex-col gap-2 group">
             <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-white transition-all cursor-pointer overflow-hidden">
                <span className="text-[10px] font-bold tracking-tighter">M</span>
             </div>
             
             <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2 -translate-x-4 group-hover:translate-x-0 ease-out origin-left transform scale-95 group-hover:scale-100">
               <button 
                 onClick={() => {
                   setGeneratorMode('qr');
                   setManualMode('structured'); // Reset to structured when going back to QR usually
                 }}
                 className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border text-[10px] font-medium transition-all ${generatorMode === 'qr' ? 'bg-black text-white border-black scale-110' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                 title="QR Code Mode"
               >
                 QR
               </button>
               <button 
                 onClick={() => {
                   setGeneratorMode('barcode');
                   setManualMode('plaintext'); // Force plain text for barcode
                 }}
                 className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border text-[10px] font-medium transition-all ${generatorMode === 'barcode' ? 'bg-black text-white border-black scale-110' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                 title="Barcode Mode"
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
              
              {/* Advanced Type Switcher */}
              <div className="grid grid-cols-4 gap-2 mb-2 pb-2 border-b border-gray-100">
                  <button onClick={() => setManualMode('structured')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'structured' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="Cấu trúc">
                      <AlignLeft className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-medium uppercase">Cấu trúc</span>
                  </button>
                  <button onClick={() => setManualMode('plaintext')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'plaintext' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="Văn bản">
                      <Hash className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-medium uppercase">Văn bản</span>
                  </button>
                   {generatorMode === 'qr' && (
                     <>
                        <button onClick={() => setManualMode('wifi')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'wifi' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="Wi-Fi">
                            <Wifi className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">Wi-Fi</span>
                        </button>
                        <button onClick={() => setManualMode('vcard')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'vcard' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="Danh thiếp">
                            <Smartphone className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">vCard</span>
                        </button>
                        <button onClick={() => setManualMode('url')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'url' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="URL Marketing">
                            <Globe className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">URL</span>
                        </button>
                         <button onClick={() => setManualMode('email')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'email' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="Email">
                            <Mail className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">Email</span>
                        </button>
                         <button onClick={() => setManualMode('event')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'event' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="Sự kiện">
                            <Calendar className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">Event</span>
                        </button>
                         <button onClick={() => setManualMode('vietqr')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'vietqr' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="VietQR">
                            <CreditCard className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">VietQR</span>
                        </button>
                         <button onClick={() => setManualMode('location')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'location' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="Vị trí">
                            <MapPin className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">Vị trí</span>
                        </button>
                         <button onClick={() => setManualMode('app')} className={`flex flex-col items-center p-2 rounded-lg transition-all ${manualMode === 'app' ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-500'}`} title="App">
                            <LinkIcon className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium uppercase">App Link</span>
                        </button>
                     </>
                   )}
              </div>
              
              <div className="flex justify-end px-1 pb-4 border-b border-gray-100 mb-4">
                  <button onClick={resetApp} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    Xóa tất cả
                  </button>
              </div>

              {/* Forms Content */}
              <div className="space-y-4">
                  
                  {manualMode === 'structured' && (
                    <>
                      <div className="max-h-[350px] overflow-y-auto pr-1 space-y-3">
                        {fields.map(field => (
                          <FieldInput key={field.id} field={field} onUpdate={updateField} onRemove={removeField} />
                        ))}
                      </div>
                      <button onClick={addField} className="group flex items-center justify-center w-full py-4 rounded-xl border border-dashed border-gray-200 hover:border-black transition-all mt-2 text-sm text-[#86868b] hover:text-black">
                        <Plus className="w-3 h-3 mr-2 transition-transform group-hover:rotate-90" /> Thêm trường
                      </button>
                    </>
                  )}

                  {manualMode === 'plaintext' && (
                    <div className="relative">
                       {generatorMode === 'barcode' && (
                         <div className={`text-[10px] mb-2 px-2 py-1 rounded border ${plainText.length > 20 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                           {plainText.length > 20 ? `⚠️ Barcode dài (${plainText.length} kí tự) có thể khó quét.` : "ℹ️ Barcode chỉ hỗ trợ chữ cái không dấu và số."}
                         </div>
                       )}
                       <textarea
                        value={plainText}
                        onChange={(e) => setPlainText(e.target.value)}
                        placeholder="Nhập nội dung..."
                        className="w-full h-[250px] p-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 text-sm font-mono text-gray-700 bg-gray-50/50"
                      />
                    </div>
                  )}

                  {manualMode === 'wifi' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Tên Wifi (SSID)" value={wifiData.ssid} onChange={e => setWifiData({...wifiData, ssid: e.target.value})} />
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Mật khẩu" value={wifiData.password} onChange={e => setWifiData({...wifiData, password: e.target.value})} />
                        <div className="flex gap-2">
                             <select className="p-3 rounded-lg border border-gray-200 text-sm bg-white flex-1" value={wifiData.type} onChange={e => setWifiData({...wifiData, type: e.target.value})}>
                                 <option value="WPA">WPA/WPA2</option>
                                 <option value="WEP">WEP</option>
                                 <option value="nopass">Không mật khẩu</option>
                             </select>
                             <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                                 <input type="checkbox" checked={wifiData.hidden} onChange={e => setWifiData({...wifiData, hidden: e.target.checked})} />
                                 <span className="text-sm">Ẩn?</span>
                             </label>
                        </div>
                    </div>
                  )}

                  {manualMode === 'url' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="URL (https://...)" value={urlData.url} onChange={e => setUrlData({...urlData, url: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                             <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="utm_source (fb, google)" value={urlData.utmSource} onChange={e => setUrlData({...urlData, utmSource: e.target.value})} />
                             <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="utm_medium (cpc, banner)" value={urlData.utmMedium} onChange={e => setUrlData({...urlData, utmMedium: e.target.value})} />
                             <input className="w-full p-3 rounded-lg border border-gray-200 text-sm col-span-2" placeholder="utm_campaign (sale_2024)" value={urlData.utmCampaign} onChange={e => setUrlData({...urlData, utmCampaign: e.target.value})} />
                        </div>
                    </div>
                  )}

                  {manualMode === 'vcard' && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 h-[350px] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-2">
                             <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Họ" value={vCardData.lastName} onChange={e => setVCardData({...vCardData, lastName: e.target.value})} />
                             <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Tên" value={vCardData.firstName} onChange={e => setVCardData({...vCardData, firstName: e.target.value})} />
                        </div>
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Số điện thoại" value={vCardData.mobile} onChange={e => setVCardData({...vCardData, mobile: e.target.value})} />
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Email" value={vCardData.email} onChange={e => setVCardData({...vCardData, email: e.target.value})} />
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Công ty" value={vCardData.company} onChange={e => setVCardData({...vCardData, company: e.target.value})} />
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Chức danh" value={vCardData.job} onChange={e => setVCardData({...vCardData, job: e.target.value})} />
                        <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Website" value={vCardData.website} onChange={e => setVCardData({...vCardData, website: e.target.value})} />
                     </div>
                  )}

                  {manualMode === 'email' && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Gửi đến (Email)" value={emailData.email} onChange={e => setEmailData({...emailData, email: e.target.value})} />
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Tiêu đề" value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} />
                         <textarea className="w-full p-3 rounded-lg border border-gray-200 text-sm h-32" placeholder="Nội dung..." value={emailData.body} onChange={e => setEmailData({...emailData, body: e.target.value})} />
                     </div>
                  )}

                  {manualMode === 'event' && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Tên sự kiện" value={eventData.title} onChange={e => setEventData({...eventData, title: e.target.value})} />
                         <div className="grid grid-cols-2 gap-2">
                             <label className="text-xs text-gray-500">Bắt đầu <input type="datetime-local" className="w-full p-2 border rounded mt-1" onChange={e => setEventData({...eventData, start: e.target.value})} /></label>
                             <label className="text-xs text-gray-500">Kết thúc <input type="datetime-local" className="w-full p-2 border rounded mt-1" onChange={e => setEventData({...eventData, end: e.target.value})} /></label>
                         </div>
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Địa điểm" value={eventData.location} onChange={e => setEventData({...eventData, location: e.target.value})} />
                     </div>
                  )}

                  {manualMode === 'vietqr' && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                         <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg">
                             Tạo mã VietQR (NAPAS 247) để nhận tiền chuyển khoản nhanh.
                         </div>
                         <div className="grid grid-cols-1 gap-2">
                            <select 
                                className="w-full p-3 rounded-lg border border-gray-200 text-sm bg-white"
                                value={vietQrData.bankId} 
                                onChange={e => setVietQrData({...vietQrData, bankId: e.target.value})}
                            >
                                <option value="">-- Chọn ngân hàng --</option>
                                {VIETQR_BANKS.map(bank => (
                                    <option key={bank.id} value={bank.bin}>
                                        {bank.shortName} - {bank.name}
                                    </option>
                                ))
                                }
                            </select>
                         </div>
                         {(vietQrData.bankId && !vietQrData.accountNo) && (
                            <div className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                <span>⚠️ Vui lòng nhập <b>Số tài khoản</b> để hiển thị QR Code.</span>
                            </div>
                         )}
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Số tài khoản" value={vietQrData.accountNo} onChange={e => setVietQrData({...vietQrData, accountNo: e.target.value})} />
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" type="number" placeholder="Số tiền (Tùy chọn)" value={vietQrData.amount} onChange={e => setVietQrData({...vietQrData, amount: e.target.value})} />
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Nội dung chuyển khoản (Tùy chọn)" value={vietQrData.content} onChange={e => setVietQrData({...vietQrData, content: e.target.value})} />
                     </div>
                  )}

                  {manualMode === 'location' && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                         <div className="grid grid-cols-2 gap-2">
                             <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Vĩ độ (Latitude)" value={locData.lat} onChange={e => setLocData({...locData, lat: e.target.value})} />
                             <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Kinh độ (Longitude)" value={locData.long} onChange={e => setLocData({...locData, long: e.target.value})} />
                         </div>
                         <div className="text-xs text-center text-gray-400">
                             Mở Google Maps trên điện thoại để lấy tọa độ.
                         </div>
                     </div>
                  )}

                  {manualMode === 'app' && (
                     <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="App Scheme (myapp://...)" value={appData.appScheme} onChange={e => setAppData({...appData, appScheme: e.target.value})} />
                         <input className="w-full p-3 rounded-lg border border-gray-200 text-sm" placeholder="Link tải dự phòng (Store/Web)" value={appData.fallback} onChange={e => setAppData({...appData, fallback: e.target.value})} />
                     </div>
                  )}

              </div>
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
