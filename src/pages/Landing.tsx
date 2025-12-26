
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Code, Terminal, Database } from 'lucide-react';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    const MacTrafficLights = () => (
        <div className="flex gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans text-[#1d1d1f] antialiased">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-200/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
                
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#1d1d1f] to-[#434344]">
                        QR Pro API
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mb-12 font-medium">
                        Seamlessly integrate QR & Barcode generation. <br/>
                        <span className="text-blue-600">Plaintext</span>, <span className="text-purple-600">Batch</span>, and <span className="text-green-600">Excel</span> support.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-[#0071e3] hover:bg-[#0077ED] text-white px-8 py-3.5 rounded-full font-medium text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Open Generator
                        </button>
                        <a 
                            href="#documentation"
                            className="bg-white hover:bg-gray-50 text-[#1d1d1f] px-8 py-3.5 rounded-full font-medium text-lg shadow-sm border border-gray-200 transition-all active:scale-95"
                        >
                            Documentation
                        </a>
                    </div>
                </div>
            </div>

            {/* Feature Cards - Mac Style */}
            <div className="max-w-6xl mx-auto pb-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: <Code className="w-6 h-6" />, title: "RESTful API", desc: "Standard JSON endpoints perfect for any codebase." },
                    { icon: <Database className="w-6 h-6" />, title: "Batch Processing", desc: "Generate thousands of codes in seconds via ZIP." },
                    { icon: <Terminal className="w-6 h-6" />, title: "Developer First", desc: "Clean types, detailed errors, and cURL examples." }
                ].map((item, i) => (
                    <div key={i} className="p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/20 hover:scale-[1.02] transition-transform duration-300">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 mb-6 shadow-inner">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 tracking-tight">{item.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* Documentation Section */}
            <div id="documentation" className="max-w-5xl mx-auto py-20 px-6">
                <div className="flex items-center gap-4 mb-16">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Book className="w-8 h-8 text-gray-900" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">API Reference</h2>
                        <p className="text-gray-500">Comprehensive guide to integrating QR Pro.</p>
                    </div>
                </div>

                <div className="space-y-20">
                    
                    {/* Endpoint 1: QR Gen Plain */}
                    <section>
                        <div className="mb-6 flex items-baseline gap-3">
                             <div className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-md text-sm">POST</div>
                             <h3 className="text-2xl font-bold text-[#1d1d1f]">/api/generate/plain</h3>
                             <span className="text-gray-400 font-medium">Generate Single QR</span>
                        </div>
                        
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100">
                             {/* Step 1 */}
                             <div className="p-8 border-b border-gray-100">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">1</span>
                                    Prepare Payload
                                </h4>
                                <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-inner text-sm font-mono leading-relaxed overflow-x-auto">
                                    <MacTrafficLights />
                                    <pre className="text-[#a5b3ce]">
{`{
  "text": `}<span className="text-[#98c379]">"https://example.com"</span>{`,  `}<span className="text-gray-500">// Required: Content to encode</span>{`
  "options": {
      "width": `}<span className="text-[#d19a66]">500</span>{`,        `}<span className="text-gray-500">// Optional: px (Default: 300)</span>{`
      "colorDark": `}<span className="text-[#98c379]" >"#000000"</span><span className="text-gray-500">  // Optional: Hex color</span>{`
  }
}`}
                                    </pre>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">2</span>
                                    Test Command
                                </h4>
                                <div className="bg-[#282c34] p-6 rounded-2xl shadow-lg border border-gray-700/50 text-sm font-mono text-gray-300 overflow-x-auto">
                                   <div className="flex gap-2 text-xs mb-3 opacity-50 font-sans font-medium">TERMINAL</div>
                                   <div>
                                       <span className="text-[#c678dd]">curl</span> -X POST http://localhost:3000/api/generate/plain \<br/>
                                       &nbsp;&nbsp;-H <span className="text-[#98c379]">"Content-Type: application/json"</span> \<br/>
                                       &nbsp;&nbsp;-d <span className="text-[#e5c07b]">{`'{ "text": "Hello World", "options": { "width": 300 } }'`}</span>
                                   </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-8 bg-white">
                                <h4 className="font-semibold text-[#1d1d1f] mb-4">Parameter Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                                    <div>
                                        <strong className="text-gray-900 block mb-2">Request Body</strong>
                                        <ul className="space-y-2">
                                            <li><code className="text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">text</code> (string, required): The URL or text content.</li>
                                            <li><code className="text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">options</code> (object): Quality settings.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <strong className="text-gray-900 block mb-2">Response</strong>
                                        <p className="mb-2">Returns a JSON object containing the Data URI.</p>
                                        <div className="bg-gray-100 p-3 rounded-lg font-mono text-xs text-gray-700">
                                            {`{ "data": "data:image/png;base64,iVB..." }`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Endpoint 2: Batch */}
                    <section>
                         <div className="mb-6 flex items-baseline gap-3">
                             <div className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-md text-sm">POST</div>
                             <h3 className="text-2xl font-bold text-[#1d1d1f]">/api/generate/batch</h3>
                             <span className="text-gray-400 font-medium">Generate Multiple (ZIP)</span>
                        </div>
                        
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100">
                             <div className="p-8 border-b border-gray-100">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">1</span>
                                    Prepare Payload
                                </h4>
                                <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-inner text-sm font-mono leading-relaxed overflow-x-auto">
                                    <MacTrafficLights />
                                    <pre className="text-[#a5b3ce]">
{`{
  "items": [
      { "text": `}<span className="text-[#98c379]">"QR1"</span>{`, "filename": `}<span className="text-[#98c379]">"code_1.png"</span>{` },
      { "text": `}<span className="text-[#98c379]">"QR2"</span>{`, "filename": `}<span className="text-[#98c379]">"code_2.png"</span>{` }
  ],
  "options": { "width": 300 }
}`}
                                    </pre>
                                </div>
                            </div>

                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">2</span>
                                    Test Command
                                </h4>
                                <div className="bg-[#282c34] p-6 rounded-2xl shadow-lg border border-gray-700/50 text-sm font-mono text-gray-300 overflow-x-auto">
                                    <div className="flex gap-2 text-xs mb-3 opacity-50 font-sans font-medium">TERMINAL</div>
                                   <div>
                                       <span className="text-[#c678dd]">curl</span> -X POST http://localhost:3000/api/generate/batch \<br/>
                                       &nbsp;&nbsp;-H <span className="text-[#98c379]">"Content-Type: application/json"</span> \<br/>
                                       &nbsp;&nbsp;-d <span className="text-[#e5c07b]">{`'{ "items": [{"text":"A","filename":"a.png"}], "options": {"width":300} }'`}</span> \<br/>
                                       &nbsp;&nbsp;--output <span className="text-[#61afef]">batch_codes.zip</span>
                                   </div>
                                </div>
                            </div>
                            
                            <div className="p-8 bg-white">
                                <h4 className="font-semibold text-[#1d1d1f] mb-4">Parameter Details</h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex gap-3">
                                        <code className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded h-fit">items</code>
                                        <span>Array of objects. Each object needs <code>text</code> (content) and <code>filename</code> (output name inside ZIP).</span>
                                    </li>
                                     <li className="flex gap-3">
                                        <code className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded h-fit">options</code>
                                        <span>Global styling applied to ALL items in the batch.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Endpoint 3: Excel */}
                    <section>
                         <div className="mb-6 flex items-baseline gap-3">
                             <div className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-md text-sm">POST</div>
                             <h3 className="text-2xl font-bold text-[#1d1d1f]">/api/generate/excel</h3>
                             <span className="text-gray-400 font-medium">From Excel (ZIP)</span>
                        </div>

                         <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100">
                             <div className="p-8 border-b border-gray-100">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">1</span>
                                    Excel File Structure
                                </h4>
                                <p className="text-sm text-gray-500 mb-4">Create a standard <code>.xlsx</code> file with headers.</p>
                                <div className="bg-white border rounded-lg overflow-hidden mb-3 shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="p-3 border-r font-medium text-gray-700">Full Name</th>
                                                    <th className="p-3 border-r font-medium text-gray-700">Code</th>
                                                    <th className="p-3 border-r font-medium text-gray-700">Dept</th>
                                                    <th className="p-3 font-medium text-gray-400 italic">...</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b last:border-0">
                                                    <td className="p-3 border-r text-gray-600">John Doe</td>
                                                    <td className="p-3 border-r text-gray-600 font-mono text-xs">EMP01</td>
                                                    <td className="p-3 border-r text-gray-600">Eng</td>
                                                    <td className="p-3 text-gray-400 italic">...</td>
                                                </tr>
                                                 <tr>
                                                    <td className="p-3 border-r text-gray-600">Jane Smith</td>
                                                    <td className="p-3 border-r text-gray-600 font-mono text-xs">EMP02</td>
                                                    <td className="p-3 border-r text-gray-600">Design</td>
                                                    <td className="p-3 text-gray-400 italic">...</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                </div>
                                <div className="space-y-2 text-xs text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p><strong>🔹 Content:</strong> Concatenates all "Header: Value" pairs (e.g. <code>Full Name: John Doe, Code: EMP01...</code>).</p>
                                    <p><strong>🔹 Filename:</strong> Concatenates all values (e.g. <code>John Doe - EMP01 - Eng.png</code>).</p>
                                </div>
                            </div>
                            
                            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">2</span>
                                    Test Command
                                </h4>
                                <div className="bg-[#282c34] p-6 rounded-2xl shadow-lg border border-gray-700/50 text-sm font-mono text-gray-300 overflow-x-auto">
                                    <div className="flex gap-2 text-xs mb-3 opacity-50 font-sans font-medium">TERMINAL</div>
                                   <div>
                                       <span className="text-[#c678dd]">curl</span> -X POST -F <span className="text-[#98c379]">"file=@data.xlsx"</span> \<br/>
                                       &nbsp;&nbsp;-F <span className="text-[#e5c07b]">{`'options={"width": 400, "header": true}'`}</span> \<br/>
                                       &nbsp;&nbsp;http://localhost:3000/api/generate/excel \<br/>
                                       &nbsp;&nbsp;--output <span className="text-[#61afef]">excel_batch.zip</span>
                                   </div>
                                </div>
                            </div>

                             <div className="p-8 bg-white">
                                <h4 className="font-semibold text-[#1d1d1f] mb-4">Parameter Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                                    <div>
                                        <strong className="text-gray-900 block mb-2">1. File Upload</strong>
                                        <p className="mb-2">Use <code>-F "file=@/abs/path/to/file.xlsx"</code></p>
                                        <p className="text-xs text-gray-400">The <code>@</code> symbol is critical; it tells cURL to read from the disk.</p>
                                    </div>
                                    <div>
                                        <strong className="text-gray-900 block mb-2">2. Options</strong>
                                        <p className="mb-2"><code>width</code>: Image size (px).</p>
                                        <p><code>header</code>: <b>true</b> (Key: Value), <b>false</b> (Values only).</p>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </section>

                    {/* Endpoint 4: Payment */}
                    <section>
                        <div className="mb-6 flex items-baseline gap-3">
                             <div className="bg-teal-100 text-teal-700 font-bold px-3 py-1 rounded-md text-sm">POST</div>
                             <h3 className="text-2xl font-bold text-[#1d1d1f]">/api/generate/payment</h3>
                             <span className="text-gray-400 font-medium">VietQR Payment</span>
                        </div>

                         <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-gray-100">
                             <div className="p-8 border-b border-gray-100">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">1</span>
                                    Prepare Payload
                                </h4>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-inner text-sm font-mono leading-relaxed overflow-x-auto h-fit">
                                        <MacTrafficLights />
                                        <pre className="text-[#a5b3ce]">
{`{
  "bankBin": `}<span className="text-[#98c379]">"970422"</span>{`,   `}<span className="text-gray-500">// MB Bank</span>{`
  "accountNumber": `}<span className="text-[#98c379]">"12345678"</span>{`,
  "amount": `}<span className="text-[#d19a66]">50000</span>{`,    `}<span className="text-gray-500">// VND</span>{`
  "content": `}<span className="text-[#98c379]">"Dinner"</span>{`,
  "options": { "width": 400 }
}`}
                                        </pre>
                                    </div>
                                    <div>
                                         <table className="w-full text-sm border-separate border-spacing-0">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="pb-3 border-b border-gray-100 font-medium text-gray-500">Field</th>
                                                    <th className="pb-3 border-b border-gray-100 font-medium text-gray-500">Type</th>
                                                    <th className="pb-3 border-b border-gray-100 font-medium text-gray-500">Note</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700">
                                                <tr className="group">
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors font-mono text-xs text-pink-600">bankBin</td>
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50">String</td>
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50 text-gray-500">Bin code (e.g. 970422)</td>
                                                </tr>
                                                 <tr className="group">
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors font-mono text-xs text-pink-600">accountNumber</td>
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50">String</td>
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50 text-gray-500">Receiving account</td>
                                                </tr>
                                                  <tr className="group">
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50 transition-colors font-mono text-xs text-pink-600">amount</td>
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50">Num/Str</td>
                                                    <td className="py-3 border-b border-gray-50 group-hover:bg-gray-50 text-gray-500">Optional. Valid VND amount.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                             <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                                <h4 className="text-lg font-semibold mb-4 text-[#1d1d1f] flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs text-gray-600">2</span>
                                    Test Command
                                </h4>
                                <div className="bg-[#282c34] p-6 rounded-2xl shadow-lg border border-gray-700/50 text-sm font-mono text-gray-300 overflow-x-auto">
                                    <div className="flex gap-2 text-xs mb-3 opacity-50 font-sans font-medium">TERMINAL</div>
                                   <div>
                                       <span className="text-[#c678dd]">curl</span> -X POST http://localhost:3000/api/generate/payment \<br/>
                                       &nbsp;&nbsp;-H <span className="text-[#98c379]">"Content-Type: application/json"</span> \<br/>
                                       &nbsp;&nbsp;-d <span className="text-[#e5c07b]">{`'{ "bankBin": "970422", "accountNumber": "123", "amount": 50000, "content": "Test" }'`}</span>
                                   </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center text-sm text-gray-400">
                <p>&copy; 2024 QR Generator Pro. Designed with focus.</p>
            </footer>
        </div>
    );
};

export default Landing;
