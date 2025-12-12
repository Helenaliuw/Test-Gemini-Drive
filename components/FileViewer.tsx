import React, { useState, useEffect } from 'react';
import { XIcon, SparklesIcon, InfoIcon, TrashIcon, DownloadIcon } from './Icons';
import { DriveFile, FileType } from '../types';
import { formatBytes, getFileExtension } from '../services/utils';
import { analyzeFileWithGemini } from '../services/geminiService';

interface FileViewerProps {
  file: DriveFile | null;
  onClose: () => void;
  onUpdateFile: (updatedFile: DriveFile) => void;
  onDeleteRequest: (file: DriveFile) => void;
  onFileDownload: (file: DriveFile) => void;
  downloadingFileId: string | null;
}

export const FileViewer: React.FC<FileViewerProps> = ({ file, onClose, onUpdateFile, onDeleteRequest, onFileDownload, downloadingFileId }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  
  // Local state for editing
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (file) {
      setName(file.name);
      setNotes(file.notes || '');
    }
  }, [file]);

  const handleSave = () => {
    if (file && (name !== file.name || notes !== file.notes)) {
      onUpdateFile({
        ...file,
        name,
        notes
      });
    }
  };

  if (!file) return null;

  const isDownloading = downloadingFileId === file.id;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
        const prompt = analysisPrompt.trim() || (file.type === FileType.IMAGE 
            ? "Describe this image in detail." 
            : "Summarize the content of this file.");
        
        // Use the base64 download_url directly for analysis
        const result = await analyzeFileWithGemini(file.download_url, file.mimeType, prompt);
        
        onUpdateFile({
            ...file,
            aiSummary: result
        });
    } catch (e) {
        console.error("Error analyzing file:", e);
    } finally {
        setIsAnalyzing(false);
    }
  };


  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
    >
      <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row p-4 gap-4">
        
        {/* Top Bar (Mobile) or Close Button */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }} 
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
        >
            <XIcon size={24} />
        </button>

        {/* Left: Content Viewer */}
        <div 
            className="flex-1 bg-black/20 rounded-2xl overflow-hidden flex items-center justify-center relative group border border-white/10"
            onClick={(e) => e.stopPropagation()}
        >
            {file.type === FileType.IMAGE ? (
                <img src={file.download_url} alt={file.name} className="max-w-full max-h-full object-contain shadow-2xl" />
            ) : (
                <div className="text-white flex flex-col items-center p-8 text-center">
                    <div className="w-24 h-24 flex items-center justify-center mb-4">
                        <span className={`fiv-viv fiv-icon-${getFileExtension(file.name)}`} style={{ fontSize: '96px' }}></span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{name}</h2>
                    <p className="text-slate-300">Preview not available for this file type.</p>
                </div>
            )}
        </div>

        {/* Right: Info & AI Panel */}
        <div 
            className="w-full md:w-96 bg-white rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-4">
                    {/* Editable Title */}
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleSave}
                        className="w-full text-xl font-bold text-slate-900 leading-tight bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none py-1 transition-all"
                        placeholder="File Name"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                    <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Type</p>
                        <p>{file.type}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Size</p>
                        <p>{formatBytes(file.size)}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">Created</p>
                        <p>{new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <InfoIcon size={16} className="text-indigo-500"/> User Notes
                    </h3>
                    {/* Editable Notes */}
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onBlur={handleSave}
                        placeholder="Add notes here..."
                        className="w-full px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-100 focus:bg-white focus:border-indigo-500 focus:outline-none resize-none transition-all min-h-[80px]"
                    />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <SparklesIcon size={16} className="text-indigo-500"/> Gemini Analysis
                    </h3>
                    
                    {file.aiSummary ? (
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 text-sm text-slate-800 leading-relaxed animate-fadeIn">
                             <div className="prose prose-sm prose-indigo max-w-none">
                                {file.aiSummary}
                             </div>
                             <button 
                                onClick={() => onUpdateFile({...file, aiSummary: undefined})}
                                className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                             >
                                Regenerate
                             </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <textarea
                                value={analysisPrompt}
                                onChange={(e) => setAnalysisPrompt(e.target.value)}
                                placeholder={file.type === FileType.IMAGE ? "Ask about this image..." : "Ask about this file..."}
                                className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none resize-none bg-white"
                                rows={2}
                            />
                            <button 
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isAnalyzing ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Analyzing...</>
                                ) : (
                                    <><SparklesIcon size={16} /> Analyze with Gemini</>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                 <button
                    onClick={() => onFileDownload(file)}
                    disabled={isDownloading}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                    {isDownloading ? (
                        <><span className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"/> <span>Downloading...</span></>
                    ) : (
                        <><DownloadIcon size={16} /> <span>Download</span></>
                    )}
                </button>
                <button
                    onClick={() => onDeleteRequest(file)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                    <TrashIcon size={16} />
                    <span>Delete File</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};