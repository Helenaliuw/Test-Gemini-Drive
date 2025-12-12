import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    SearchIcon, 
    PlusIcon, 
    GridIcon, 
    ListIcon, 
    HardDriveIcon, 
    ClockIcon, 
    SparklesIcon,
    LogOutIcon,
    UserIcon,
    LogoIcon,
    ChevronDownIcon
} from './components/Icons';
import { DriveFile, FilterState, FileType, User } from './types';
import { UploadModal } from './components/UploadModal';
import { FileGrid } from './components/FileGrid';
import { FileViewer } from './components/FileViewer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ProfileModal } from './components/ProfileModal';
import { Auth } from './components/Auth';
import { formatBytes, fileToBase64, getFileType } from './services/utils';

// --- MOCK DATA ---
const initialFiles: DriveFile[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: FileType.PDF,
    mimeType: 'application/pdf',
    size: 1200000,
    download_url: '', // PDF preview is not supported, so this is fine
    storagePath: '',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    notes: 'Initial proposal for the Q3 project.',
    aiSummary: 'This document outlines the scope, goals, and timeline for the upcoming quarterly project, focusing on market expansion and product development.',
  },
  {
    id: '2',
    name: 'Team Meeting Notes.txt',
    type: FileType.TEXT,
    mimeType: 'text/plain',
    size: 5000,
    download_url: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==', // "Hello, World!"
    storagePath: '',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    notes: 'Action items from the weekly sync.',
    aiSummary: '',
  },
  {
    id: '3',
    name: 'logo-design.png',
    type: FileType.IMAGE,
    mimeType: 'image/png',
    size: 78000,
    download_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIQSURBVHhe7ZtBToNAEIbp/S924gPxB/gD/CGeiCde3BC3II/gwe01W2aW2J2lTd1Ue22aFE20o+n0Pz/vL09fP6pSAAAAAAAAgCMwLyzp9Do93RO2E30rQd+C7z4bN6oEjy8Pdbv9g3wvyzYw34346vY8E+fN9iF+P84+e12mCRs9s0A+s28yF98P5z3P518L8g3+b+Y1sOAZyP/N4d6G321i+eW62i8N9yub5TdbG75Z7f7f4/LsewIAAAAAAAAABwW4sM/v90+Bv6/X/z+fXh++Wa5f/f4f/A9/BwAAAAAAAAAAToCBf/Y/m2/6+fcrzqH/mYd/d5+ZXwYAAAAAAAAAAGdggY/P87+v15+P+x1+dp3p8+Vn4P/i88/PZwIAAAAAAAAAADhBAp/P9/s/y+fl145n/v/p83P/t5enZ+kFAAAAAAAAAMAJCvyvP38fvi/fP59+fmP8Py7P3/5+3q+AAS4AAAAAAAAAABwQgS/b3+f79eW19fPz6+s3y7/fL1/e/L4PAAAAAAAAAADOBd7/f/y+ff7/+Pv6/fn3x+s3AAAAAAAAAADgBNj58vn59fXl8/Pr8++fXx//v5+fn98PAQAAAAAAAAD+EWB32E70rYR+C94/dwI+BwAAAAAAAAAATuC9AAMAAAAAAAAAAIAf4A8AAAAAAAD+A/gDNAAA+As4BPgLmAQA+BMsAQAAAAAAADiCvwCRi4BfduaeUQAAAABJRU5ErkJggg==', // a sample 64x64 blue dot
    storagePath: '',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    notes: 'Final logo design.',
    aiSummary: 'A minimalist logo featuring geometric shapes with a blue and green color palette, symbolizing growth and stability.',
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false); // No real auth, so no loading state

  // --- Auth handlers ---
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };
  const handleLogout = () => {
    setUser(null);
  };

  // --- App State ---
  const [files, setFiles] = useState<DriveFile[]>(initialFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<DriveFile | null>(null);
  const [activeView, setActiveView] = useState<'DRIVE' | 'RECENT' | 'AI'>('DRIVE');
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [filters, setFilters] = useState<FilterState>({ search: '', type: 'ALL', dateRange: 'ALL' });
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  
  // --- Storage Calculation ---
  const totalStorage = 5 * 1024 * 1024 * 1024; // 5 GB

  const usedStorage = useMemo(() => {
    return files.reduce((acc, file) => acc + file.size, 0);
  }, [files]);

  const storagePercentage = useMemo(() => {
    if (totalStorage === 0) return 0;
    return Math.min((usedStorage / totalStorage) * 100, 100);
  }, [usedStorage, totalStorage]);

  // --- Handlers ---
  const handleUpload = async (file: File, name: string, notes: string) => {
    if (!user) return;

    const download_url = await fileToBase64(file);
    const now = Date.now();
    const newFile: DriveFile = {
      id: crypto.randomUUID(),
      name: name || file.name,
      type: getFileType(file.type),
      mimeType: file.type,
      size: file.size,
      download_url,
      storagePath: '', // Not used
      createdAt: now,
      updatedAt: now,
      notes,
      aiSummary: '',
    };
    setFiles(prevFiles => [newFile, ...prevFiles]);
  };

  const handleUpdateFile = async (updatedFile: DriveFile) => {
    if (!user) return;
    const newFiles = files.map(f => f.id === updatedFile.id ? { ...updatedFile, updatedAt: Date.now() } : f);
    setFiles(newFiles);
    if (viewingFile?.id === updatedFile.id) {
      setViewingFile({ ...updatedFile, updatedAt: Date.now() });
    }
  };

  const handleDeleteFile = (file: DriveFile) => {
    setFileToDelete(file);
  };

  const handleConfirmDelete = async () => {
    if (!user || !fileToDelete) return;
    setFiles(files.filter(f => f.id !== fileToDelete!.id));
    setFileToDelete(null);
    if(viewingFile?.id === fileToDelete.id) {
        setViewingFile(null);
    }
  };
  
  const handleDownloadFile = async (file: DriveFile) => {
    if (downloadingFileId === file.id) return;
    setDownloadingFileId(file.id);
    try {
        if (!file.download_url) {
            alert("No content to download for this file.");
            return;
        }
        const link = document.createElement('a');
        link.href = file.download_url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Oops! Something went wrong while trying to download the file.");
    } finally {
      setDownloadingFileId(null);
    }
  };

  const handleUpdateProfile = async (updates: { displayName?: string; photoFile?: File | null }) => {
    if (!user) return;
    let newPhotoURL = user.photoURL;
    if (updates.photoFile) {
        newPhotoURL = await fileToBase64(updates.photoFile);
    } else if (updates.photoFile === null) {
        newPhotoURL = null;
    }

    setUser({
        ...user,
        displayName: updates.displayName || user.displayName,
        photoURL: newPhotoURL
    });
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // --- Filtering logic ---
  const filteredFiles = useMemo(() => {
    let tempFiles = [...files];

    if (activeView === 'RECENT') {
        tempFiles.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
        tempFiles.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (activeView === 'AI') {
        tempFiles = tempFiles.filter(f => f.aiSummary);
    }

    if (filters.search) {
        tempFiles = tempFiles.filter(file => 
            file.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            (file.notes && file.notes.toLowerCase().includes(filters.search.toLowerCase()))
        );
    }

    if (filters.type !== 'ALL') {
        tempFiles = tempFiles.filter(f => f.type === filters.type);
    }

    if (filters.dateRange !== 'ALL') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        let cutoff: number;
        switch(filters.dateRange) {
            case 'TODAY': cutoff = today; break;
            case 'WEEK': cutoff = today - 7 * 24 * 60 * 60 * 1000; break;
            case 'MONTH': cutoff = today - 30 * 24 * 60 * 60 * 1000; break;
            default: cutoff = 0;
        }
        if (cutoff > 0) {
            tempFiles = tempFiles.filter(f => f.createdAt >= cutoff);
        }
    }
    
    return tempFiles;
  }, [files, filters, activeView]);

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }
  
  return (
    <div className="h-screen w-screen bg-white text-slate-900 flex font-sans">
        {/* Sidebar */}
        <nav className="w-64 border-r border-slate-100 flex flex-col p-6 flex-shrink-0">
            <div className="flex items-center gap-3 h-10 mb-8">
                <LogoIcon />
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">Gemini Drive</span>
            </div>

            <div className="mb-8">
                 <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-3 w-full p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                    <span className="p-1.5 bg-indigo-100 rounded-lg">
                        <PlusIcon size={20} className="text-indigo-600" />
                    </span>
                    <span className="font-semibold text-slate-700">New Upload</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col gap-1">
                <SidebarButton name="My Drive" icon={HardDriveIcon} active={activeView === 'DRIVE'} onClick={() => setActiveView('DRIVE')} />
                <SidebarButton name="Recent" icon={ClockIcon} active={activeView === 'RECENT'} onClick={() => setActiveView('RECENT')} />
                <SidebarButton name="AI Analyzed" icon={SparklesIcon} active={activeView === 'AI'} onClick={() => setActiveView('AI')} />
            </div>

            <div className="mt-auto">
                <div className="mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                         <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out" 
                                style={{ width: `${storagePercentage}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                             <span>{formatBytes(usedStorage)} used</span>
                             <span>5 GB</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 -mx-6 px-4 pt-4">
                    <button 
                        onClick={() => setIsProfileModalOpen(true)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-medium flex-shrink-0">
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover"/>
                            ) : (
                                user.displayName?.charAt(0).toUpperCase() || <UserIcon size={20} />
                            )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{user.displayName || 'User'}</p>
                            <p className="text-slate-500 text-xs truncate">{user.email}</p>
                        </div>
                        <LogOutIcon onClick={(e) => { e.stopPropagation(); handleLogout(); }} size={20} className="text-slate-400 hover:text-slate-700" />
                    </button>
                </div>
            </div>
        </nav>

        {/* Main Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
            {/* Header for Main Area */}
            <header className="flex-shrink-0 bg-white border-b border-slate-200 z-10">
                <div className="flex items-center justify-between h-20 px-8 gap-8">
                     {/* Search Bar */}
                    <div className="relative flex-1 max-w-2xl">
                        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search files, notes, or AI insights..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                            <GridIcon size={18} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="flex-shrink-0 px-8 py-4 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-4">
                    <FilterDropdown 
                        label="All types"
                        value={filters.type}
                        onChange={(v) => handleFilterChange('type', v)}
                        options={[
                            { label: 'All types', value: 'ALL' },
                            { label: 'Image', value: FileType.IMAGE },
                            { label: 'PDF', value: FileType.PDF },
                            { label: 'Text', value: FileType.TEXT },
                            { label: 'Other', value: FileType.OTHER },
                        ]}
                    />
                     <FilterDropdown 
                        label="Any time"
                        value={filters.dateRange}
                        onChange={(v) => handleFilterChange('dateRange', v)}
                        options={[
                            { label: 'Any time', value: 'ALL' },
                            { label: 'Today', value: 'TODAY' },
                            { label: 'Last 7 days', value: 'WEEK' },
                            { label: 'Last 30 days', value: 'MONTH' },
                        ]}
                    />
                </div>
            </div>


            {/* File Grid Area */}
            <main className="flex-1 overflow-y-auto p-8">
                 <FileGrid 
                    files={filteredFiles} 
                    viewMode={viewMode} 
                    onFileClick={setViewingFile}
                    onDeleteRequest={handleDeleteFile}
                    onFileDownload={handleDownloadFile}
                    downloadingFileId={downloadingFileId}
                 />
            </main>
        </div>

        {/* Modals */}
        <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handleUpload} />
        <FileViewer 
            file={viewingFile} 
            onClose={() => setViewingFile(null)} 
            onUpdateFile={handleUpdateFile} 
            onDeleteRequest={handleDeleteFile} 
            onFileDownload={handleDownloadFile}
            downloadingFileId={downloadingFileId}
        />
        <ConfirmationModal 
            isOpen={!!fileToDelete}
            onClose={() => setFileToDelete(null)}
            onConfirm={handleConfirmDelete}
            title="Delete File"
            message={`Are you sure you want to delete "${fileToDelete?.name}"? This action cannot be undone.`}
        />
         <ProfileModal 
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            user={user}
            onUpdate={handleUpdateProfile}
        />
    </div>
);
};

// --- Helper Components ---
const SidebarButton: React.FC<{name: string, icon: React.FC<any>, active: boolean, onClick: () => void}> = ({ name, icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
            active
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-100'
        }`}
    >
        <Icon size={20} className={active ? 'text-indigo-500' : 'text-slate-400'}/>
        {name}
    </button>
);

const FilterDropdown: React.FC<{label: string, value: string, options: {label: string, value: string}[], onChange: (value: string) => void}> = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedLabel = options.find(o => o.value === value)?.label || label;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
                <span>{selectedLabel}</span>
                <ChevronDownIcon size={16} className="text-slate-400"/>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-20 animate-fadeInScale py-1">
                    {options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => { onChange(option.value); setIsOpen(false); }}
                            className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;