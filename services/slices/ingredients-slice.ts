import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../../utils/burger-api';

export type TIngredientsState = {
  ingredients: TIngredient[];
  ingredientsRequest: boolean;
  ingredientsFailed: boolean;
  error: string | null;
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  ingredientsRequest: false,
  ingredientsFailed: false,
  error: null,
  selectedIngredient: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при загрузке ингредиентов'
      );
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (
      state,
      action: PayloadAction<TIngredient | null>
    ) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.ingredientsRequest = true;
        state.ingredientsFailed = false;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredientsRequest = false;
          state.ingredientsFailed = false;
          state.ingredients = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.ingredientsRequest = false;
        state.ingredientsFailed = true;
        state.error = action.payload as string;
      });
  }
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientsSlice.actions;

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

export default ingredientsSlice.reducer;
