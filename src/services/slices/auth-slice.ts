// src/services/slices/auth-slice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';

// Тип для ответа с токенами
type TAuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

// Состояние авторизации
export type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

// Thunk для логина
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      console.log('Attempting to login with:', {
        email: data.email,
        password: '****'
      });
      const response = await loginUserApi(data);
      console.log('Login successful, response:', {
        ...response,
        user: response.user
      });

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при входе'
      );
    }
  }
);

// Thunk для регистрации
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      console.log('Attempting to register with:', {
        email: data.email,
        name: data.name,
        password: '****'
      });
      const response = await registerUserApi(data);
      console.log('Registration successful, response:', {
        ...response,
        user: response.user
      });

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при регистрации'
      );
    }
  }
);

// Thunk для выхода из системы
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Attempting to logout');
      await logoutApi();
      console.log('Logout successful');

      return;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при выходе'
      );
    }
  }
);

// Thunk для получения данных пользователя
export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Attempting to get user data');
      const response = await getUserApi();
      console.log('Get user successful, response:', response);
      return response.user;
    } catch (error) {
      console.error('Get user error:', error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка при получении данных пользователя'
      );
    }
  }
);

// Thunk для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      console.log('Attempting to update user with:', data);
      const response = await updateUserApi(data);
      console.log('Update user successful, response:', response);
      return response.user;
    } catch (error) {
      console.error('Update user error:', error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка при обновлении данных пользователя'
      );
    }
  }
);

// Thunk для проверки авторизации
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    console.log('Checking auth state');

    // Проверяем наличие токенов
    const token = localStorage.getItem('accessToken');
    console.log('Token exists:', !!token);

    if (token) {
      try {
        console.log('Token exists, getting user data');
        // Пытаемся получить данные пользователя
        await dispatch(getUser()).unwrap();
        console.log('Successfully got user data');
      } catch (error) {
        console.error('Error getting user data, clearing tokens', error);
        // В случае ошибки очищаем токены
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
      }
    } else {
      console.log('No token found, user is not authenticated');
    }

    // В любом случае помечаем, что проверка авторизации завершена
    return;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Сброс ошибок авторизации
    resetAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Обработка login
    builder
      .addCase(loginUser.pending, (state) => {
        console.log('loginUser.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          console.log('loginUser.fulfilled');
          state.isLoading = false;
          state.user = action.payload.user;
          state.isAuthChecked = true;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        console.log('loginUser.rejected');
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка register
    builder
      .addCase(registerUser.pending, (state) => {
        console.log('registerUser.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          console.log('registerUser.fulfilled');
          state.isLoading = false;
          state.user = action.payload.user;
          state.isAuthChecked = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        console.log('registerUser.rejected');
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка logout
    builder
      .addCase(logout.pending, (state) => {
        console.log('logout.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        console.log('logout.fulfilled');
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        console.log('logout.rejected');
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка getUser
    builder
      .addCase(getUser.pending, (state) => {
        console.log('getUser.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        console.log('getUser.fulfilled');
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        console.log('getUser.rejected');
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      });

    // Обработка updateUser
    builder
      .addCase(updateUser.pending, (state) => {
        console.log('updateUser.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        console.log('updateUser.fulfilled');
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.log('updateUser.rejected');
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка checkAuth
    builder.addCase(checkAuth.fulfilled, (state) => {
      console.log('checkAuth.fulfilled');
      state.isAuthChecked = true;
    });
  }
});

// Экспортируем экшены
export const { resetAuthError } = authSlice.actions;

// Экспортируем селекторы
export const selectUser = (state: { auth: TAuthState }) => state.auth.user;
export const selectIsAuthChecked = (state: { auth: TAuthState }) =>
  state.auth.isAuthChecked;
export const selectIsLoading = (state: { auth: TAuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: TAuthState }) =>
  state.auth.error;

// Экспортируем редюсер
export default authSlice.reducer;
