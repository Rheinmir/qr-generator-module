import React, { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  titleMode?: 'qr' | 'barcode' | string;
}

export const Layout: React.FC<LayoutProps> = ({ children, titleMode = 'QR' }) => {
  const displayTitle = titleMode === 'qr' ? 'QR' : (titleMode === 'barcode' ? 'Barcode' : titleMode);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 animate-in fade-in zoom-in duration-700">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-2 py-4">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            <span>{displayTitle}</span> Generator
          </h1>
          <p className="text-sm text-[#86868b] font-medium">Tối giản. Chuyên nghiệp. Hiệu quả.</p>
        </header>

        {children}

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-[10px] text-[#86868b] font-medium tracking-wide uppercase">Minimalist Design System</p>
        </footer>
      </div>
    </div>
  );
};
