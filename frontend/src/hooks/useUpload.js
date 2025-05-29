import { useState } from 'react';
import { uploadFile, verifyData } from '../services/api';
import { handleError } from '../utils/helpers';

/**
 * Custom hook for handling file uploads and verification
 * @returns {Object} Upload methods and state
 */
export const useUpload = () => {
  const [uploadState, setUploadState] = useState({
    isLoading: false,
    progress: 0,
    error: null,
    result: null
  });

  const resetUpload = () => {
    setUploadState({
      isLoading: false,
      progress: 0,
      error: null,
      result: null
    });
  };

  const upload = async (file, token) => {
    setUploadState(prev => ({
      ...prev,
      isLoading: true,
      progress: 0,
      error: null
    }));

    try {
      const result = await uploadFile(file, token, (progress) => {
        setUploadState(prev => ({ ...prev, progress }));
      });
      
      setUploadState(prev => ({
        ...prev,
        isLoading: false,
        result
      }));
      return result;
    } catch (error) {
      const formattedError = handleError(error);
      setUploadState(prev => ({
        ...prev,
        isLoading: false,
        error: formattedError
      }));
      throw formattedError;
    }
  };

  const verify = async (hash, token) => {
    setUploadState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const result = await verifyData(hash, token);
      setUploadState(prev => ({
        ...prev,
        isLoading: false,
        result
      }));
      return result;
    } catch (error) {
      const formattedError = handleError(error);
      setUploadState(prev => ({
        ...prev,
        isLoading: false,
        error: formattedError
      }));
      throw formattedError;
    }
  };

  return {
    ...uploadState,
    upload,
    verify,
    resetUpload
  };
};