// src/utils/burger-api.ts
import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from '@utils-types';

// API URL
const URL = 'https://norma.nomoreparties.space/api';
console.log('API URL:', URL);

// Общая функция для проверки ответа
const checkResponse = <T>(res: Response): Promise<T> => {
  console.log('Response status:', res.status);
  return res.ok
    ? res.json().then((data) => {
        console.log('Response data:', data);
        return data;
      })
    : res.json().then((err) => {
        console.error('Response error:', err);
        return Promise.reject(err);
      });
};

// Типы ответов от сервера
type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

type TUserResponse = TServerResponse<{ user: TUser }>;

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

// Типы для запросов
export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

// Обновление токена
export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      localStorage.setItem(
        'accessToken',
        refreshData.accessToken.replace('Bearer ', '')
      );
      return refreshData;
    });

// Запрос с обновлением токена при необходимости
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && options.headers) {
      (options.headers as { [key: string]: string }).authorization =
        `Bearer ${accessToken}`;
    }

    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err: any) {
    if (err.message === 'jwt expired') {
      try {
        const refreshData = await refreshToken();

        if (options.headers) {
          (options.headers as { [key: string]: string }).authorization =
            `Bearer ${refreshData.accessToken.replace('Bearer ', '')}`;
        }

        const res = await fetch(url, options);
        return await checkResponse<T>(res);
      } catch (refreshErr) {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshErr);
      }
    } else {
      return Promise.reject(err);
    }
  }
};

// API для ингредиентов
type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

export const getIngredientsApi = () => {
  console.log('Making API request to:', `${URL}/ingredients`);
  return fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      console.log('Ingredients API response processed:', data);
      if (data?.success) return data.data;
      console.error('API returned success: false');
      return Promise.reject(data);
    })
    .catch((error) => {
      console.error('Error in getIngredientsApi:', error);
      throw error;
    });
};

// API для ленты заказов
type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// API для получения заказов пользователя
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

// API для создания заказа
type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

// API для получения заказа по номеру
type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

// API для регистрации
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem(
          'accessToken',
          data.accessToken.replace('Bearer ', '')
        );
        return data;
      }
      return Promise.reject(data);
    });

// API для входа
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem(
          'accessToken',
          data.accessToken.replace('Bearer ', '')
        );
        return data;
      }
      return Promise.reject(data);
    });

// API для восстановления пароля
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// API для сброса пароля
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// API для получения данных пользователя
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem('accessToken')}`
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

// API для обновления данных пользователя
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: `Bearer ${localStorage.getItem('accessToken')}`
    } as HeadersInit,
    body: JSON.stringify(user)
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

// API для выхода
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');
        return data;
      }
      return Promise.reject(data);
    });
