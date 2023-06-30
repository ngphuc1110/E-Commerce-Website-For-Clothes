import { createSlice } from "@reduxjs/toolkit";
import { updateOrderApi } from "./orderApi";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateDeliveryStatusStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDeliveryStatusSuccess: (state, action) => {
      state.loading = false;
      const updatedOrder = action.payload;
      state.orders = state.orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      );
    },
    updateDeliveryStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateDeliveryStatusStart,
  updateDeliveryStatusSuccess,
  updateDeliveryStatusFailure,
} = ordersSlice.actions;

export const updateDeliveryStatus =
  (orderId, deliveryStatus) => async (dispatch) => {
    try {
      dispatch(updateDeliveryStatusStart());
      const updatedOrder = await updateOrderApi(orderId, {
        Delivery_Status: deliveryStatus,
      });
      dispatch(updateDeliveryStatusSuccess(updatedOrder));
    } catch (error) {
      dispatch(updateDeliveryStatusFailure(error.message));
    }
  };

export default ordersSlice.reducer;
