import axios from "axios";

export const userApi = async (formData, endpoint) => {
  try {
    const response = await axios.get(`http://localhost:5000/users`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUserApi = async (userID) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/users/${userID}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserApi = async (userID) => {
  try {
    const response = await axios.get(`http://localhost:5000/users/${userID}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserApi = async (userID, updatedUserData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/users/edit/${userID}`,
      updatedUserData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
