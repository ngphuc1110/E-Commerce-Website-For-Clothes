import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const addCartItem = async (userID, cartItems) => {
  try {
    if (!userID) {
      throw new Error("UserID is empty");
    }
    const response = await axios.put(
      `${API_BASE_URL}/users/${userID}/cart`,
      cartItems
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const clearCartApi = async (userID) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userID}/cart`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};
