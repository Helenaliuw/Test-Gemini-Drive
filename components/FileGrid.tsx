import React from 'react';
import { DriveFile, FileType } from '../types';
import { FileTextIcon, SparklesIcon, TrashIcon, DownloadIcon } from './Icons';
import { formatBytes, getFileExtension } from '../services/utils';

interface FileGridProps {
  files: DriveFile[];
  viewMode: 'grid' | 'list';
  onFileClick: (file: DriveFile) => void;
  onDeleteRequest: (file: DriveFile) => void;
  onFileDownload: (file: DriveFile) => void;
  downloadingFileId: string | null;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, viewMode, onFileClick, onDeleteRequest, onFileDownload, downloadingFileId }) => {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center h-full">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <FileTextIcon size={48} className="text-slate-400" />
        </div>
        <h3 className="text-slate-900 font-semibold text-xl">No files found</h3>
        <p className="text-slate-500 mt-2 max-w-xs">Upload a file to get started or adjust your search filters.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Date Uploaded</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {files.map((file) => {
              const ext = getFileExtension(file.name);
              const isDownloading = downloadingFileId === file.id;
              return (
                <tr 
                  key={file.id} 
                  onClick={() => onFileClick(file)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                     <span className={`fiv-viv fiv-icon-${ext}`} style={{ fontSize: '20px' }}></span>
                     {file.name}
                  </td>
                  <td className="px-6 py-4">{new Date(file.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                      <div className="capitalize text-slate-900">{file.type.toLowerCase()}</div>
                      {file.notes && (
                          <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]" title={file.notes}>
                              {file.notes}
                          </div>
                      )}
                  </td>
                  <td className="px-6 py-4">{formatBytes(file.size)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onFileDownload(file); }}
                        disabled={isDownloading}
                        className="p-2 rounded-md text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                        title="Download file"
                    >
                        {isDownloading ? <span className="inline-block w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"/> : <DownloadIcon size={16} />}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteRequest(file); }}
                        className="p-2 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete file"
                    >
                        <TrashIcon size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {files.map((file) => {
        const ext = getFileExtension(file.name);
        const isDownloading = downloadingFileId === file.id;
        return (
          <div 
              key={file.id}
              onClick={() => onFileClick(file)}
              className="group relative bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 transition-all cursor-pointer overflow-hidden flex flex-col aspect-[4/5]"
          >
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onFileDownload(file); }}
                  disabled={isDownloading}
                  className="p-1.5 w-7 h-7 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full text-slate-500 hover:text-indigo-600 hover:bg-white transition-all disabled:opacity-50"
                  title="Download file"
                >
                    {isDownloading ? <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"/> : <DownloadIcon size={16} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteRequest(file); }}
                  className="p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-slate-500 hover:text-red-600 hover:bg-white transition-all"
                  title="Delete file"
                >
                    <TrashIcon size={16} />
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center">
                  {file.type === FileType.IMAGE ? (
                      <img src={file.download_url} alt={file.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                          <span className={`fiv-viv fiv-icon-${ext}`} style={{ fontSize: '56px' }}></span>
                          <span className="text-xs font-medium mt-3 uppercase tracking-wider opacity-50">{ext}</span>
                      </div>
                  )}
                  
                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Footer Info */}
              <div className="p-3 bg-white border-t border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-slate-900 text-sm truncate flex-1 mr-2" title={file.name}>{file.name}</h3>
                      {file.aiSummary && <SparklesIcon size={12} className="text-indigo-500 flex-shrink-0" />}
                  </div>
                  
                  {file.notes && (
                    <p className="text-xs text-slate-500 truncate mb-2 pb-2 border-b border-slate-50" title={file.notes}>
                        {file.notes}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 flex justify-between items-center">
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      <span>{formatBytes(file.size)}</span>
                  </p>
              </div>
          </div>
        );
      })}
    </div>
  );
};
