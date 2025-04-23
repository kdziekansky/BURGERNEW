// src/pages/profile-orders/profile-orders.tsx
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
// Импортируем из правильного пути
import { getProfileOrders } from '../../services/slices/profile-orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // Получаем данные из Redux store
  const orders = useSelector((state) => state.profileOrders?.orders || []);
  const isLoading = useSelector(
    (state) => state.profileOrders?.isLoading || false
  );
  const error = useSelector((state) => state.profileOrders?.error || null);

  // Загружаем заказы пользователя при монтировании компонента
  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  // Показываем прелоадер при загрузке
  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  // Показываем сообщение об ошибке, если загрузка не удалась
  if (error) {
    return (
      <p className='text text_type_main-medium'>Произошла ошибка: {error}</p>
    );
  }

  // Отображаем UI с заказами пользователя
  return <ProfileOrdersUI orders={orders} />;
};
