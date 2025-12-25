
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
                        E-Learning HRM Integration
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
                        Powerful QR & Barcode generation API for seamless integration with your HRM systems.
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
                    
                    {/* Endpoint 1 */}
                    <section>
                        <h3 className="text-xl font-semibold text-[#1B3664] border-l-4 border-[#5BD1C6] pl-3 mb-4">
                            1. Trigger Workflow
                        </h3>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x border-b">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600 flex items-center">URL</div>
                                <div className="p-4 font-mono text-sm break-all text-blue-600">
                                    https://defaultafc21379100b463d8325cd1686ae94.ca.environment.api.powerplatform.com...
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x border-b">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600 flex items-center">Method</div>
                                <div className="p-4 font-bold text-green-600">POST</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x border-b">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600 flex items-center">Headers</div>
                                <div className="p-4 font-mono text-sm">Content-Type: application/json</div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] divide-y md:divide-y-0 md:divide-x">
                                <div className="p-4 bg-gray-50 font-semibold text-gray-600">Body Schema</div>
                                <div className="p-4 bg-[#f8f9fa] overflow-x-auto">
                                    <pre className="text-sm text-pink-600 font-mono">
{`{
    "type": "object",
    "properties": {
        "list": { "type": "string" },
        "password": { "type": "string" }
    }
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-700 mb-2">Request Example</h4>
                            <div className="bg-[#1e1e1e] text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "list": "emp",
  "password": "123456"
}`}
                            </div>
                        </div>
                    </section>

                    {/* Endpoint 2 / Response Info */}
                    <section>
                         <h3 className="text-xl font-semibold text-[#1B3664] border-l-4 border-[#5BD1C6] pl-3 mb-4">
                            2. Response Structure (Data Source)
                        </h3>
                        <p className="text-gray-600 mb-4">
                            The API returns a JSON array containing the requested objects (Employees or Organizations).
                        </p>
                        
                        <div className="overflow-x-auto border rounded-xl shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#1B3664] text-white">
                                    <tr>
                                        <th className="px-6 py-3">Field Name</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-white hover:bg-gray-50">
                                        <td className="px-6 py-3 font-mono text-blue-700">EmployeeName</td>
                                        <td className="px-6 py-3">String</td>
                                        <td className="px-6 py-3 text-gray-600">Full name of the employee</td>
                                    </tr>
                                    <tr className="bg-gray-50 hover:bg-gray-100">
                                        <td className="px-6 py-3 font-mono text-blue-700">Code</td>
                                        <td className="px-6 py-3">String</td>
                                        <td className="px-6 py-3 text-gray-600">Employee ID Number</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                    
                    {/* Local API Types */}
                    <div className="flex items-center gap-3 mt-16 mb-8 border-b pb-4">
                        <Terminal className="w-8 h-8 text-[#1B3664]" />
                        <h2 className="text-3xl font-bold text-[#1B3664]">QR Generator API</h2>
                    </div>
                    <p className="mb-4 text-gray-600">Call these endpoints to generate QR codes directly from your application.</p>

                    {/* Endpoint 3: QR Gen Plain */}
                    <section>
                        <h3 className="text-xl font-semibold text-[#1B3664] border-l-4 border-purple-500 pl-3 mb-4">
                            3. Generate Single QR (Plaintext)
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
                    </section>

                    {/* Endpoint 4: Batch */}
                    <section className="mt-8">
                        <h3 className="text-xl font-semibold text-[#1B3664] border-l-4 border-teal-500 pl-3 mb-4">
                            4. Generate Batch QR (ZIP)
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

                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
                <p>&copy; 2024 Coteccons. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
