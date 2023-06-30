import axios from "axios";

export const categoryApi = async (formData, endpoint) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/category`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
