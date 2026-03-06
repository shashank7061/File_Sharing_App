import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload file
export const uploadFile = async (formData) => {
  try {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Send email
export const sendEmail = async (emailData) => {
  try {
    const response = await api.post('/files/send-email', emailData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Download file
export const downloadFile = async (fileId) => {
  try {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
