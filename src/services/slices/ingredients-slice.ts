// src/services/slices/ingredients-slice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

// Определяем тип состояния
export type TIngredientsState = {
  ingredients: TIngredient[];
  ingredientsRequest: boolean;
  ingredientsFailed: boolean;
  error: string | null;
  selectedIngredient: TIngredient | null;
};

// Начальное состояние
const initialState: TIngredientsState = {
  ingredients: [],
  ingredientsRequest: false,
  ingredientsFailed: false,
  error: null,
  selectedIngredient: null
};

// Создаем асинхронную Thunk-функцию для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching ingredients from API...');
      const response = await getIngredientsApi();
      console.log('API response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при загрузке ингредиентов'
      );
    }
  }
);

// Создаем слайс
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // Установка выбранного ингредиента
    setSelectedIngredient: (
      state,
      action: PayloadAction<TIngredient | null>
    ) => {
      state.selectedIngredient = action.payload;
    },
    // Сброс выбранного ингредиента
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // При начале запроса
      .addCase(fetchIngredients.pending, (state) => {
        console.log('fetchIngredients.pending');
        state.ingredientsRequest = true;
        state.ingredientsFailed = false;
        state.error = null;
      })
      // При успешном запросе
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          console.log('fetchIngredients.fulfilled with data:', action.payload);
          state.ingredientsRequest = false;
          state.ingredientsFailed = false;
          state.ingredients = action.payload;
        }
      )
      // При ошибке запроса
      .addCase(fetchIngredients.rejected, (state, action) => {
        console.log('fetchIngredients.rejected with error:', action.payload);
        state.ingredientsRequest = false;
        state.ingredientsFailed = true;
        state.error = action.payload as string;
      });
  }
});

// Экспортируем экшены
export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientsSlice.actions;

// Экспортируем селекторы
export const selectIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.ingredients;
export const selectIngredientsRequest = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.ingredientsRequest;
export const selectIngredientsFailed = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.ingredientsFailed;
export const selectIngredientsError = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.error;
export const selectSelectedIngredient = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.selectedIngredient;

// Экспортируем редюсер
export default ingredientsSlice.reducer;
