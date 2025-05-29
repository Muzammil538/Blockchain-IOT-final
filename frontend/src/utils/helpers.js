import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from './constants';

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const truncateString = (str, n = 8) => {
  if (!str) return '';
  return str.length > n * 2 
    ? `${str.substring(0, n)}...${str.substring(str.length - n)}` 
    : str;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFile = (file, allowedTypes, maxSizeMB = 10) => {
  if (!file) return { valid: false, error: 'No file selected' };
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
    };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { 
      valid: false, 
      error: `File too large. Max size: ${maxSizeMB}MB` 
    };
  }

  return { valid: true, error: null };
};

export const handleError = (error, customMessage = null) => {
  console.error('Error:', error);
  const message = customMessage || 
                error.message || 
                ERROR_MESSAGES.DEFAULT;
  toast.error(message);
  return { success: false, error: message };
};

export const generateRandomHash = () => {
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(16).padStart(8, '0')).join('');
};