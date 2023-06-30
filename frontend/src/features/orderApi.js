import axios from "axios";

export const orderApi = async (formData, endpoint) => {
  try {
    const response = await axios.get(`http://localhost:5000/orders`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOrderByIDApi = async (orderId) => {
  try {
    const response = await axios.get(`http://localhost:5000/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOrderDetailsByIDApi = async (orderId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/orders/details/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateOrderApi = async (orderId, updatedOrderData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/orders/${orderId}`,
      updatedOrderData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
