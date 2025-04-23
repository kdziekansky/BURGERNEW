import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

// Тип для данных заказа, которые приходят с сервера
type TOrderResponse = {
  order: TOrder;
  name: string;
};

// Определение типа состояния
export type TOrderState = {
  orderData: TOrderResponse | null;
  orderRequest: boolean;
  orderFailed: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TOrderState = {
  orderData: null,
  orderRequest: false,
  orderFailed: false,
  error: null
};

// Создаем асинхронную Thunk-функцию для создания заказа
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

// Создаем слайс
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Сброс данных заказа (например, после закрытия модального окна)
    clearOrder: (state) => {
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // При начале запроса
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderFailed = false;
        state.error = null;
      })
      // При успешном запросе
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.orderRequest = false;
          state.orderFailed = false;
          state.orderData = action.payload;
        }
      )
      // При ошибке запроса
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderFailed = true;
        state.error = action.payload as string;
      });
  }
});

// Экспортируем экшены
export const { clearOrder } = orderSlice.actions;

// Экспортируем селекторы
export const selectOrderData = (state: { order: TOrderState }) =>
  state.order.orderData;
export const selectOrderRequest = (state: { order: TOrderState }) =>
  state.order.orderRequest;
export const selectOrderFailed = (state: { order: TOrderState }) =>
  state.order.orderFailed;
export const selectOrderError = (state: { order: TOrderState }) =>
  state.order.error;

// Экспортируем редюсер
export default orderSlice.reducer;
