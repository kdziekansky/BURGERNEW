import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

type TOrderResponse = {
  order: TOrder;
  name: string;
};

export type TOrderState = {
  orderData: TOrderResponse | null;
  orderRequest: boolean;
  orderFailed: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderData: null,
  orderRequest: false,
  orderFailed: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      return await orderBurgerApi(ingredientIds);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при оформлении заказа'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderFailed = false;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.orderRequest = false;
          state.orderFailed = false;
          state.orderData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderFailed = true;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const selectOrderData = (state: { order: TOrderState }) =>
  state.order.orderData;
export const selectOrderRequest = (state: { order: TOrderState }) =>
  state.order.orderRequest;
export const selectOrderFailed = (state: { order: TOrderState }) =>
  state.order.orderFailed;
export const selectOrderError = (state: { order: TOrderState }) =>
  state.order.error;

export default orderSlice.reducer;
