import React from 'react';

// Helper to standardize SVG props
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const IconBase: React.FC<IconProps> = ({ size = 24, className = "", children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

export const LogoIcon: React.FC<IconProps> = (props) => (
    <svg width={props.size || 32} height={props.size || 32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="32" height="32" rx="8" fill="url(#paint0_linear_1_2)"/>
      <path d="M16 8L14.4375 13.0625C14.3125 13.4375 14.0312 13.7188 13.6562 13.8438L8.5 15.5L13.6562 17.1562C14.0312 17.2812 14.3125 17.5625 14.4375 17.9375L16 23L17.5625 17.9375C17.6875 17.5625 17.9688 17.2812 18.3438 17.1562L23.5 15.5L18.3438 13.8438C17.9688 13.7188 17.6875 13.4375 17.5625 13.0625L16 8Z" fill="white"/>
      <defs>
        <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7"/>
          <stop offset="1" stopColor="#6366F1"/>
        </linearGradient>
      </defs>
    </svg>
);

export const GridIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></IconBase>
);

export const ListIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></IconBase>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconBase>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></IconBase>
);

export const FileTextIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></IconBase>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></IconBase>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></IconBase>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></IconBase>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></IconBase>
);

export const ClockIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></IconBase>
);

export const HardDriveIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><line x1="22" y1="12" x2="2" y2="12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /><line x1="6" y1="16" x2="6.01" y2="16" /><line x1="10" y1="16" x2="10.01" y2="16" /></IconBase>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></IconBase>
);

export const FilterIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></IconBase>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></IconBase>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><polyline points="6 9 12 15 18 9" /></IconBase>
);

export const LogOutIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></IconBase>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></IconBase>
);

export const AtSignIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" /></IconBase>
);

export const LockIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></IconBase>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></IconBase>
);

export const EyeOffIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></IconBase>
);

export const MailIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></IconBase>
);

export const FolderIcon: React.FC<IconProps> = (props) => (
    <IconBase {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></IconBase>
);

export const GoogleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.356-11.303-7.918l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.592 34.933 48 29.825 48 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

export const EditIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></IconBase>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <IconBase {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></IconBase>
);