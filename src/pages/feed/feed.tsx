// src/pages/feed/feed.tsx
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
// Импортируем из созданного нами слайса
import { getFeeds } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Получаем данные из нашего стора
  const orders = useSelector((state) => state.feed?.orders || []);
  const total = useSelector((state) => state.feed?.total || 0);
  const totalToday = useSelector((state) => state.feed?.totalToday || 0);
  const isLoading = useSelector((state) => state.feed?.isLoading || false);
  const error = useSelector((state) => state.feed?.error || null);

  // Собираем данные для передачи в компонент
  const feed = {
    orders,
    total,
    totalToday
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  // Функция обновления ленты заказов
  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  // Показываем прелоадер при загрузке или если данные еще не загружены
  if (isLoading || (!orders.length && !error)) {
    return <Preloader />;
  }

  // Показываем сообщение об ошибке, если загрузка не удалась
  if (error) {
    return (
      <p className='text text_type_main-medium'>Произошла ошибка: {error}</p>
    );
  }

  // Если данные загружены, отображаем UI
  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
