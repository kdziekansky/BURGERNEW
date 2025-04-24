import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed?.orders || []);
  const total = useSelector((state) => state.feed?.total || 0);
  const totalToday = useSelector((state) => state.feed?.totalToday || 0);
  const isLoading = useSelector((state) => state.feed?.isLoading || false);
  const error = useSelector((state) => state.feed?.error || null);

  const feed = {
    orders,
    total,
    totalToday
  };

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  if (isLoading || (!orders.length && !error)) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium'>Произошла ошибка: {error}</p>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
