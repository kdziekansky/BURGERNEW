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

export const AppContent: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [loadingError, setLoadingError] = useState<string | null>(null);

  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    dispatch(checkAuth()).catch((err) => {
      setLoadingError(
        'Ошибка проверки авторизации: попробуйте перезагрузить страницу'
      );
    });

    dispatch(fetchIngredients()).catch((err) => {
      setLoadingError(
        'Ошибка загрузки ингредиентов: попробуйте перезагрузить страницу'
      );
    });
  }, [dispatch]);

  const background = location.state && location.state.background;

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

  if (!isAuthChecked) {
    return <Preloader />;
  }

  return (
    <>
      <AppHeader />
      <AppRoutes location={background || location} />
      {background && <ModalRoutes />}
    </>
  );
};
