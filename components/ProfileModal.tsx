import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { XIcon, UserIcon, TrashIcon } from './Icons';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (updates: { displayName?: string; photoFile?: File | null }) => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null | undefined>(undefined);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && isOpen) {
      setDisplayName(user.displayName || '');
      setPhotoPreview(user.photoURL || null);
      setPhotoFile(undefined); // Reset file interaction state on open
    }
  }, [user, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleRemovePhoto = () => {
      setPhotoFile(null); // null is a special value to signal deletion
      setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
        const updates: { displayName?: string; photoFile?: File | null } = {};
        const trimmedName = displayName.trim();

        if (trimmedName && trimmedName !== user.displayName) {
            updates.displayName = trimmedName;
        }
       
        if (photoFile !== undefined) {
            updates.photoFile = photoFile;
        }

        if (Object.keys(updates).length > 0) {
            await onUpdate(updates);
        }
      onClose();
    } catch (error) {
      console.error("Profile update failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeInScale">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 hover:border-indigo-500 transition-colors group">
                    {photoPreview ? (
                        <img src={photoPreview} alt="Profile Preview" className="w-full h-full object-cover"/>
                    ) : (
                        <UserIcon size={40} className="text-slate-400 group-hover:text-indigo-500"/>
                    )}
                </button>
                {photoPreview && (
                    <button type="button" onClick={handleRemovePhoto} title="Remove photo" className="absolute bottom-0 right-0 p-1.5 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors">
                        <TrashIcon size={14} />
                    </button>
                )}
            </div>
             <p className="text-sm text-slate-500">Click image to upload or change photo</p>
          </div>
        
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
            <input 
              type="text" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
             <p className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-sm">{user.email}</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
             <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
            </button>
            <button 
              type="submit" 
              disabled={isProcessing}
              className="px-4 py-2 flex justify-center items-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};