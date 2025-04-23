// src/services/slices/feed-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

// Импортируем функцию API из burger-api.ts
import { getFeedsApi } from '../../utils/burger-api';

// Создаем асинхронное действие для получения данных ленты заказов
export const getFeeds = createAsyncThunk(
  'feed/getFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response; // Возвращаем данные с сервера
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при получении ленты заказов'
      );
    }
  }
);

// Определяем тип состояния
interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
}

// Инициализируем начальное состояние
const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Создаем слайс Redux
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка статуса "loading"
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка успешного получения данных
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      // Обработка ошибки
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Экспортируем редьюсер
export const feedReducer = feedSlice.reducer;
