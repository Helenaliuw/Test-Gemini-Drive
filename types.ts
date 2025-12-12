export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export enum FileType {
  IMAGE = 'IMAGE',
  TEXT = 'TEXT',
  PDF = 'PDF',
  OTHER = 'OTHER',
}

export interface DriveFile {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  download_url: string; // Will now be a base64 data URL
  storagePath: string; // No longer used, but kept for type consistency
  createdAt: number;
  updatedAt: number;
  notes: string;
  aiSummary?: string; // Field for Gemini analysis
}

export interface FilterState {
  search: string;
  type: FileType | 'ALL';
  dateRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
}