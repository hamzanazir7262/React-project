import axios from 'axios';
import Swal from 'sweetalert2';
import { baseUrl , getToken } from './config'; // Adjust the import path according to your project structure

export const createBooth = async (boothData) => {
  try {
    const response = await axios.post(`${baseUrl}/api/booths/v1/booths`, boothData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booth:', error);
    throw error;
  }
};

export const getBoothById = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/api/booths/v1/booths/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching booth by ID:', error);
      throw error;
    }
  };
  export const updateBooth = async (id, updatedData) => {
    try {
      const response = await axios.put(`${baseUrl}/api/booths/v1/booths/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating booth:', error);
      throw error;
    }
  };
  export const deleteBooth = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/api/booths/v1/booths/${id}`, {
        headers: {
           'accept': 'application/json',
                Authorization: `Bearer ${getToken()}`
        },
      });
      Swal.fire("Success", "Booth deleted successfully", "success")
      return response.data;
    } catch (error) {
      console.error('Error deleting booth:', error);
      throw error;
    }
  };
  export const getAllBooths = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/booths/v1/booths/all`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all booths:', error);
      throw error;
    }
  };
  export const getBooths = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get(`${baseUrl}/api/booths/v1/booths`, {
        params: {
          page,
          limit,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching paginated booths:', error);
      throw error;
    }
  };
          