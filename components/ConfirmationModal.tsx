import React from 'react';
import { XIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeInScale"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">{title}</h2>
            <p className="text-sm text-slate-600">{message}</p>
        </div>
        <div className="px-6 py-4 bg-slate-50 flex justify-end items-center gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 border border-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
                Delete
            </button>
        </div>
      </div>
    </div>
  );
};
