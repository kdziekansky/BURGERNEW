// src/services/reducers/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredients-slice';
import constructorReducer from '../slices/constructor-slice';
import orderReducer from '../slices/order-slice';
import authReducer from '../slices/auth-slice';
import { feedReducer } from '../slices/feed-slice';
import { profileOrdersReducer } from '../slices/profile-orders-slice';

// Комбинируем все редьюсеры в корневой редьюсер
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
