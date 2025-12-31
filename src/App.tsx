import { useState } from 'react';
import { Upload, Download, Share2, Check, Copy } from 'lucide-react';

interface FileShare {
  code: string;
  file: File;
  url: string;
}

function App() {
  const [view, setView] = useState<'upload' | 'download'>('upload');
  const [fileShares, setFileShares] = useState<Map<string, FileShare>>(new Map());
  const [uploadedCode, setUploadedCode] = useState<string>('');
  const [downloadCode, setDownloadCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const generateCode = (): string => {
    let code: string;
    do {
      code = Math.floor(1000 + Math.random() * 9000).toString();
    } while (fileShares.has(code));
    return code;
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    const code = generateCode();
    const url = URL.createObjectURL(file);

    const newShare: FileShare = { code, file, url };
    setFileShares(new Map(fileShares.set(code, newShare)));
    setUploadedCode(code);
    setError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDownload = () => {
    const share = fileShares.get(downloadCode);

    if (!share) {
      setError('Invalid code. Please check and try again.');
      return;
    }

    const a = document.createElement('a');
    a.href = share.url;
    a.download = share.file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setError('');
    setDownloadCode('');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(uploadedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAgNGgybC4wMDgtMmgtMi4wMDh2MnptLTItMnYySDMydi0yaDF6bTEtM3YySDMzdi0yaDF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Share2 className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">FileShare</h1>
          <p className="text-slate-300 text-lg">Secure file sharing with 4-digit codes</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex border-b border-white/20">
            <button
              onClick={() => {
                setView('upload');
                setError('');
                setUploadedCode('');
              }}
              className={`flex-1 py-4 px-6 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                view === 'upload'
                  ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Upload className="w-5 h-5" />
              Upload File
            </button>
            <button
              onClick={() => {
                setView('download');
                setError('');
                setDownloadCode('');
              }}
              className={`flex-1 py-4 px-6 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                view === 'download'
                  ? 'bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Download className="w-5 h-5" />
              Download File
            </button>
          </div>

          <div className="p-8">
            {view === 'upload' ? (
              <div className="space-y-6">
                {!uploadedCode ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      isDragging
                        ? 'border-cyan-400 bg-cyan-500/10 scale-105'
                        : 'border-white/30 hover:border-cyan-400/50 hover:bg-white/5'
                    }`}
                  >
                    <Upload className="w-16 h-16 text-cyan-400 mx-auto mb-4" strokeWidth={1.5} />
                    <p className="text-white text-lg mb-2 font-medium">Drop your file here</p>
                    <p className="text-slate-400 mb-6">or click to browse</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium cursor-pointer hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 inline-block shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105">
                        Select File
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border border-cyan-400/30 animate-slide-up">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                      </div>
                    </div>
                    <h3 className="text-white text-2xl font-bold text-center mb-2">File Uploaded!</h3>
                    <p className="text-slate-300 text-center mb-6">Share this code to allow downloads</p>

                    <div className="bg-slate-900/50 rounded-xl p-6 mb-4 border border-white/10">
                      <p className="text-slate-400 text-sm mb-2 text-center">Your Share Code</p>
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-5xl font-bold text-cyan-400 tracking-wider font-mono">
                          {uploadedCode}
                        </div>
                        <button
                          onClick={copyCode}
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Copy code"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/30 rounded-xl p-4 border border-white/5">
                      <p className="text-slate-300 text-sm mb-1">
                        <span className="font-medium">File:</span> {fileShares.get(uploadedCode)?.file.name}
                      </p>
                      <p className="text-slate-300 text-sm">
                        <span className="font-medium">Size:</span> {formatFileSize(fileShares.get(uploadedCode)?.file.size || 0)}
                      </p>
                    </div>

                    <button
                      onClick={() => setUploadedCode('')}
                      className="w-full mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
                    >
                      Upload Another File
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Download className="w-16 h-16 text-cyan-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h3 className="text-white text-2xl font-bold mb-2">Enter Share Code</h3>
                  <p className="text-slate-400">Enter the 4-digit code to download the file</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={downloadCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setDownloadCode(value);
                      setError('');
                    }}
                    placeholder="0000"
                    maxLength={4}
                    className="w-full px-6 py-4 bg-slate-900/50 border-2 border-white/20 rounded-xl text-white text-center text-4xl font-bold tracking-widest focus:outline-none focus:border-cyan-400 transition-all duration-300 font-mono placeholder:text-slate-600"
                  />

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-shake">
                      <p className="text-red-400 text-center text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleDownload}
                    disabled={downloadCode.length !== 4}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-cyan-500/30"
                  >
                    Download File
                  </button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-6">
                  <p className="text-blue-300 text-center text-sm">
                    Files are stored temporarily in your browser session
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            {fileShares.size} {fileShares.size === 1 ? 'file' : 'files'} currently shared
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default App;
