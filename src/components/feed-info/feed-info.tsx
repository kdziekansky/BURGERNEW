import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Вспомогательная функция для получения номеров заказов с определенным статусом
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из Redux store
  const orders = useSelector((state) => state.feed?.orders || []);
  const total = useSelector((state) => state.feed?.total || 0);
  const totalToday = useSelector((state) => state.feed?.totalToday || 0);

  // Собираем объект feed для передачи в компонент
  const feed = {
    total,
    totalToday
  };

  // Получаем готовые заказы (статус "done")
  const readyOrders = getOrders(orders, 'done');

  // Получаем заказы в работе (статус "pending")
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
