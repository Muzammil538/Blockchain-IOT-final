import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadFile = async (file, token, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          toast.success('File uploaded successfully');
          resolve(response);
        } catch (e) {
          reject(new Error('Invalid server response'));
        }
      } else {
        const error = JSON.parse(xhr.responseText)?.message || 'Upload failed';
        reject(new Error(error));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.ontimeout = () => reject(new Error('Upload timeout'));

    xhr.open('POST', `${API_BASE_URL}/upload`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.timeout = 300000; // 5 minutes timeout
    xhr.send(formData);
  });
};

export const uploadToCloudinary = async (file, preset, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    const response = await fetch(`${API_BASE_URL}/upload/cloudinary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Cloudinary upload failed');
    }

    const result = await response.json();
    toast.success('File uploaded to Cloudinary');
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    toast.error(error.message || 'Cloudinary upload failed');
    throw error;
  }
};

export const verifyUploadIntegrity = async (dataHash, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify?hash=${dataHash}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Verification failed');
    }

    const result = await response.json();
    if (result.verified) {
      toast.success('Data integrity verified');
    } else {
      toast.error('Data verification failed');
    }
    return result;
  } catch (error) {
    console.error('Verification error:', error);
    toast.error(error.message || 'Verification error');
    throw error;
  }
};

export const getUploadHistory = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/uploads`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch history');
    }

    return await response.json();
  } catch (error) {
    console.error('History fetch error:', error);
    toast.error(error.message || 'Failed to load history');
    throw error;
  }
};