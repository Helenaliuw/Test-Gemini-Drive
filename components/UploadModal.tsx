import React, { useCallback, useState, useEffect } from 'react';
import { XIcon, UploadIcon, FileTextIcon, ImageIcon, SparklesIcon } from './Icons';
import { FileType, DriveFile } from '../types';
import { fileToBase64, getFileType, formatBytes, getFileExtension } from '../services/utils';
import { generateFileName } from '../services/geminiService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, name: string, notes: string) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGeneratingName, setIsGeneratingName] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setNotes('');
      setName('');
      setPreviewUrl('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setName(selectedFile.name);
      const base64 = await fileToBase64(selectedFile);
      setPreviewUrl(base64);
    }
  };

  const handleAutoName = async () => {
    if (!file || !previewUrl) return;
    setIsGeneratingName(true);
    try {
        const generatedName = await generateFileName(previewUrl, file.type);
        if (generatedName) {
            setName(generatedName);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsGeneratingName(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);

    try {
      await onUpload(file, name || file.name, notes);
      onClose(); // Close only on success
    } catch (error) {
      console.error('Upload failed', error);
      // You could add a user-facing error message here
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeInScale">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Upload File</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 transition-all group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                    <UploadIcon size={24} />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-700">Click to upload</p>
                <p className="text-xs text-slate-500">SVG, PNG, JPG or PDF (MAX. 10MB)</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="space-y-4">
              {/* File Preview Snippet */}
              <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className={`fiv-viv fiv-icon-${getFileExtension(file.name)}`} style={{ fontSize: '32px' }}></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                         <button 
                            type="button" 
                            onClick={handleAutoName} 
                            className="text-indigo-500 hover:text-indigo-700 p-1 rounded-md hover:bg-indigo-50 transition-colors"
                            title="Generate Name with AI"
                         >
                             <SparklesIcon size={14} className={isGeneratingName ? "animate-spin" : ""} />
                         </button>
                    </div>
                  <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                  <button 
                    type="button" 
                    onClick={() => setFile(null)} 
                    className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Metadata Inputs */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add some details..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm resize-none"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={!file || isProcessing}
              className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-indigo-200"
            >
              {isProcessing ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};