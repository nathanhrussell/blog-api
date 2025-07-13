const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'https://blog-api-cg35.onrender.com';
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${getApiUrl()}${endpoint}`;
  return fetch(url, options);
};

export const getApiEndpoint = (endpoint) => {
  return `${getApiUrl()}${endpoint}`;
};

// For backward compatibility, export the base URL
export const API_URL = getApiUrl();