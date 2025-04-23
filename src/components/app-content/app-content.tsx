// src/components/app-content/app-content.tsx
import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectIsAuthChecked } from '../../services/selectors';
import { checkAuth } from '../../services/slices/auth-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';

import { AppHeader } from '@components';
import { AppRoutes } from '../app-routes';
import { ModalRoutes } from '../modal-routes';
import { Preloader } from '@ui';

// Компонент, содержащий основное содержимое приложения
export const AppContent: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Состояние для обработки ошибок загрузки
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Проверяем авторизацию при монтировании компонента
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    console.log('AppContent mounted, checking auth and loading ingredients');

    // Проверяем авторизацию
    dispatch(checkAuth())
      .then(() => console.log('Auth check completed'))
      .catch((err) => {
        console.error('Auth check error:', err);
        setLoadingError(
          'Ошибка проверки авторизации: попробуйте перезагрузить страницу'
        );
      });

    // Загружаем ингредиенты сразу при монтировании приложения
    dispatch(fetchIngredients())
      .then(() => console.log('Initial ingredients load completed'))
      .catch((err) => {
        console.error('Initial ingredients load error:', err);
        setLoadingError(
          'Ошибка загрузки ингредиентов: попробуйте перезагрузить страницу'
        );
      });
  }, [dispatch]);

  console.log('isAuthChecked:', isAuthChecked);

  // Проверяем наличие background (для модальных окон)
  const background = location.state && location.state.background;

  // В случае ошибки загрузки показываем сообщение
  if (loadingError) {
    return (
      <div
        className='text text_type_main-medium'
        style={{ padding: '20px', textAlign: 'center' }}
      >
        {loadingError}
      </div>
    );
  }

  // Пока проверяем авторизацию, показываем загрузку
  if (!isAuthChecked) {
    console.log('Auth check still in progress, showing preloader');
    return <Preloader />;
  }

  console.log('Rendering AppContent');
  return (
    <>
      <AppHeader />
      <AppRoutes location={background || location} />
      {background && <ModalRoutes />}
    </>
  );
};
