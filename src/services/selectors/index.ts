import {
  selectIngredients,
  selectIngredientsRequest,
  selectIngredientsFailed,
  selectIngredientsError,
  selectSelectedIngredient
} from '../slices/ingredients-slice';

import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorItems
} from '../slices/constructor-slice';

import {
  selectOrderData,
  selectOrderRequest,
  selectOrderFailed,
  selectOrderError
} from '../slices/order-slice';

import {
  selectUser,
  selectIsAuthChecked,
  selectIsLoading,
  selectAuthError
} from '../slices/auth-slice';

export {
  // Ингредиенты
  selectIngredients,
  selectIngredientsRequest,
  selectIngredientsFailed,
  selectIngredientsError,
  selectSelectedIngredient,

  // Конструктор
  selectConstructorBun,
  selectConstructorIngredients,
  selectConstructorItems,

  // Заказ
  selectOrderData,
  selectOrderRequest,
  selectOrderFailed,
  selectOrderError,

  // Авторизация
  selectUser,
  selectIsAuthChecked,
  selectIsLoading,
  selectAuthError
};
