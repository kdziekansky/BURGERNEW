// src/components/protected-route/protected-route.tsx
import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthChecked } from '../../services/selectors';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  element: ReactElement;
};

// Компонент для защищенных маршрутов (требуется авторизация)
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  // Пока проверяем авторизацию, показываем загрузку
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь не авторизован, перенаправляем на страницу логина
  if (!user) {
    // Сохраняем текущий маршрут, чтобы вернуться после авторизации
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Иначе отображаем запрашиваемый элемент
  return element;
};
