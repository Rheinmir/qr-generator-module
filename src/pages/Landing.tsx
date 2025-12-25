
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Code, Terminal, Database } from 'lucide-react';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1B3664] to-[#122342] text-white py-20 px-6">
                <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        QR Generator Pro API
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
                        Professional QR & Barcode generation API for seamless integration with your applications.
                        <br />
                        Supports <span className="text-[#5BD1C6] font-medium">Plaintext</span> and <span className="text-[#5BD1C6] font-medium">Batch</span> modes.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all flex items-center gap-2 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Generator
                        </button>
                        <a 
                            href="#documentation"
                            className="bg-transparent border-2 border-white/20 hover:bg-white/10 px-8 py-3 rounded-full font-semibold text-lg transition-all"
                        >
                            Read Docs
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-6xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#1B3664] mb-4">
                        <Code className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Easy Integration</h3>
                    <p className="text-gray-600">Standard REST API endpoints for quick implementation in any language.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700 mb-4">
                        <Database className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Batch Processing</h3>
                    <p className="text-gray-600">Generate thousands of codes efficiently with our optimized batch mode endpoints.</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700 mb-4">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Plaintext Mode</h3>
                    <p className="text-gray-600">Simple and fast generation for standard text-based QR and Barcodes.</p>
                </div>
            </div>

            {/* Documentation Section */}
            <div id="documentation" className="max-w-5xl mx-auto py-12 px-6">
                <div className="flex items-center gap-3 mb-8 border-b pb-4">
                    <Book className="w-8 h-8 text-[#1B3664]" />
                    <h2 className="text-3xl font-bold text-[#1B3664]">API Documentation</h2>
                </div>

                <div className="space-y-12">
                    
                    <p className="mb-4 text-gray-600">Call these endpoints to generate QR codes directly from your application.</p>

                    {/* Endpoint 1: QR Gen Plain */}
                    <section>
                        <h3 className="text-xl font-semibold text-[#1B3664] border-l-4 border-purple-500 pl-3 mb-4">
                            1. Generate Single QR (Plaintext)
                        </h3>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x border-b">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600 flex items-center">URL</div>
                                <div className="p-4 font-mono text-sm break-all text-blue-600">
                                    POST /api/generate/plain
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600">Body</div>
                                <div className="p-4 bg-[#f8f9fa] overflow-x-auto">
                                    <pre className="text-sm text-pink-600 font-mono">
{`{
  "text": "Your Text Here",
  "options": {
      "width": 500,
      "colorDark": "#000000"
  }
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Usage Example */}
                        <div className="mt-4 bg-[#f0f9ff] border border-blue-100 rounded-xl p-4">
                            <h4 className="font-semibold text-[#1B3664] mb-2 text-sm">💡 Usage of Output (Data URI)</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                The <code>data</code> field in the response is a Base64 Data URI. You can use it directly in an <code>&lt;img&gt;</code> tag or save it as a file.
                            </p>
                            <div className="bg-gray-800 text-gray-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`<!-- HTML Example -->
<img src="data:image/png;base64,iVBORw0KGgo..." alt="QR Code" />

// JavaScript Example
const img = document.createElement('img');
img.src = response.data;
document.body.appendChild(img);`}
                            </div>
                        </div>
                    </section>

                    {/* Endpoint 2: Batch */}
                    <section className="mt-8">
                        <h3 className="text-xl font-semibold text-[#1B3664] border-l-4 border-teal-500 pl-3 mb-4">
                            2. Generate Batch QR (ZIP)
                        </h3>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x border-b">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600 flex items-center">URL</div>
                                <div className="p-4 font-mono text-sm break-all text-blue-600">
                                    POST /api/generate/batch
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600">Body</div>
                                <div className="p-4 bg-[#f8f9fa] overflow-x-auto">
                                    <pre className="text-sm text-pink-600 font-mono">
{`{
  "items": [
      { "text": "QR1", "filename": "1.png" },
      { "text": "QR2", "filename": "2.png" }
  ],
  "options": { ... }
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Endpoint 3: Excel */}
                    <section className="mt-8">
                        <h3 className="text-xl font-semibold text-[#1B3664] border-l-4 border-green-500 pl-3 mb-4">
                            3. Generate from Excel (ZIP)
                        </h3>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                             <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x border-b">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600 flex items-center">URL</div>
                                <div className="p-4 font-mono text-sm break-all text-blue-600">
                                    POST /api/generate/excel
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600">Body</div>
                                <div className="p-4 bg-[#f8f9fa] overflow-x-auto">
                                    <p className="text-sm text-gray-600 mb-2">Upload a file (multipart/form-data) with key <code>file</code>.</p>
                                    <div className="bg-gray-800 text-gray-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`curl -X POST -F "file=@data.xlsx" \\
     -F 'options={"width":300}' \\
     http://localhost:3000/api/generate/excel --output qrcodes.zip`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
                <p>&copy; 2024 QR Generator Pro. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
