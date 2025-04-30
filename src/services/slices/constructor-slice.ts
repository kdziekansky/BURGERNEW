import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const addIngredientWithId = (ingredient: TIngredient) => ({
  type: 'burgerConstructor/addIngredient',
  payload: {
    ...ingredient,
    id: uuidv4()
  }
});

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.ingredients[dragIndex];
      const newIngredients = [...state.ingredients];

      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, dragItem);

      state.ingredients = newIngredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const selectConstructorBun = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor.ingredients;
export const selectConstructorItems = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor;

export default constructorSlice.reducer;
