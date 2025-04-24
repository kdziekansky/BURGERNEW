import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getProfileOrders } from '../../services/slices/profile-orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.profileOrders?.orders || []);
  const isLoading = useSelector(
    (state) => state.profileOrders?.isLoading || false
  );
  const error = useSelector((state) => state.profileOrders?.error || null);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium'>Произошла ошибка: {error}</p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
