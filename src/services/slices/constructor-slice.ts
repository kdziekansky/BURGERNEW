import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient } from '@utils-types';

// Определение типа состояния конструктора
export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

// Начальное состояние
const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

// Создаем слайс
export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление булки в конструктор
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    // Добавление ингредиента в конструктор
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push({
        ...action.payload,
        id: uuidv4()
      });
    },
    // Удаление ингредиента из конструктора
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Перемещение ингредиента в конструкторе
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragItem = state.ingredients[dragIndex];
      const newIngredients = [...state.ingredients];

      // Удаляем элемент из старой позиции
      newIngredients.splice(dragIndex, 1);
      // Вставляем его в новую позицию
      newIngredients.splice(hoverIndex, 0, dragItem);

      state.ingredients = newIngredients;
    },
    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Экспортируем экшены
export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

// Экспортируем селекторы
export const selectConstructorBun = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor.ingredients;
export const selectConstructorItems = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor;

// Экспортируем редюсер
export default constructorSlice.reducer;
