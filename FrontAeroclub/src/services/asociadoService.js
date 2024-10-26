import axios from 'axios';

const API_URL = 'el link que tengamos de api';

export const getAsociadoData = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asociado data:', error);
    throw error;
  }
};

export const updateAsociadoProfile = async (id, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating asociado profile:', error);
    throw error;
  }
};
