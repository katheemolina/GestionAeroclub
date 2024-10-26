import axios from 'axios';

const API_URL = 'el link que tengamos de api';

export const getGestorDashboardData = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gestor dashboard data:', error);
    throw error;
  }
};
