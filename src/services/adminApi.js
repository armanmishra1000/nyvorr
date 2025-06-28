import axios from 'axios';

const API_URL = 'http://localhost:4000/api/admin';

// Helper function to get auth header with token
const getAuthHeader = () => {
  // For development, use a mock token
  const mockToken = 'dev-mock-token';
  
  // In production, you would use the actual token from the user object
  // const user = JSON.parse(localStorage.getItem('user'));
  // const token = user?.token || '';
  
  return { 
    'x-auth-token': mockToken,
    'Content-Type': 'application/json'
  };
};

export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`, { 
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Recent Activities
  getRecentActivities: async (limit = 5) => {
    try {
      const response = await axios.get(`${API_URL}/activities`, { 
        params: { limit },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error; // Re-throw to be handled by the component
    }
  },

  // Sales Data (for future charts)
  getSalesData: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/sales`, {
        params: { startDate, endDate },
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  }
};

export default adminApi;
