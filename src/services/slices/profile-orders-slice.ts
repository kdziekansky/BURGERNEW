// src/services/slices/profile-orders-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Импортируем функцию API из burger-api.ts
import { getOrdersApi } from '../../utils/burger-api';

// Создаем асинхронное действие для получения заказов пользователя
export const getProfileOrders = createAsyncThunk(
  'profileOrders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response; // Возвращаем данные с сервера
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при получении заказов'
      );
    }
  }
);

// Определяем тип состояния
interface ProfileOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

// Инициализируем начальное состояние
const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// Создаем слайс Redux
const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка статуса "loading"
      .addCase(getProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка успешного получения данных
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      // Обработка ошибки
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Экспортируем thunk action и редьюсер
export const profileOrdersReducer = profileOrdersSlice.reducer;
