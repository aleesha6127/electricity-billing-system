const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (meterSerial, phoneNumber) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ meterSerial, phoneNumber }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  verify: async () => {
    return await apiCall('/auth/verify');
  },

  logout: () => {
    removeToken();
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    return await apiCall('/users/profile');
  },

  updateProfile: async (updates) => {
    return await apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Payment API
export const paymentAPI = {
  getHistory: async () => {
    return await apiCall('/payments/history');
  },

  addFunds: async (amount) => {
    return await apiCall('/payments/add-funds', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  payBill: async () => {
    return await apiCall('/payments/pay-bill', {
      method: 'POST',
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getData: async () => {
    return await apiCall('/dashboard/data');
  },
};

export { getToken, setToken, removeToken };


