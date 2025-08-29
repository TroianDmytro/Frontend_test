import React, { useRef, useState } from 'react';
import { userService } from '../services/userService';

interface AvatarUploadProps {
  onAvatarUpdate: (newAvatarUrl: string) => void;
  onError: (error: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onAvatarUpdate,
  onError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onError('Дозволені лише файли JPG, JPEG, PNG, GIF, WEBP');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      onError('Розмір файлу не повинен перевищувати 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const response = await userService.uploadAvatar(file);
      onAvatarUpdate(response.avatarUrl);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Помилка при завантаженні аватара');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleFileSelect}
        disabled={isUploading}
        className="absolute bottom-0 right-0 bg-[#1951F3] hover:bg-[#1441CC] p-2 rounded-full border border-[#F5F5F5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Завантажити новий аватар"
      >
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        )}
      </button>
    </div>
  );
};
