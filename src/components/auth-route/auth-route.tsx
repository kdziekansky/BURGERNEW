// src/components/auth-route/auth-route.tsx
import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthChecked } from '../../services/selectors';
import { Preloader } from '@ui';

type AuthRouteProps = {
  element: ReactElement;
};

// Компонент для маршрутов, доступных только неавторизованным пользователям
export const AuthRoute: FC<AuthRouteProps> = ({ element }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  // Проверяем, были ли мы перенаправлены с защищенного маршрута
  const from = location.state?.from?.pathname || '/';

  // Пока проверяем авторизацию, показываем загрузку
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь авторизован, перенаправляем на предыдущий маршрут или главную
  if (user) {
    return <Navigate to={from} replace />;
  }

  // Иначе отображаем запрашиваемый элемент
  return element;
};
