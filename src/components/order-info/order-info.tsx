import { FC, useMemo, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { selectIngredients } from '../../services/selectors';
import { PageWrapper } from '../page-wrapper';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!number) return;

      try {
        setIsLoading(true);
        const response = await getOrderByNumberApi(Number(number));

        if (response.success && response.orders.length > 0) {
          setOrderData(response.orders[0]);
        } else {
          setError('Заказ не найден');
        }
      } catch (err) {
        setError('Ошибка при загрузке заказа');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: TIngredient & { count: number }) =>
        acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  const content = <OrderInfoUI orderInfo={orderInfo} />;
  const isModal = !!location.state?.background;

  return isModal ? (
    content
  ) : (
    <PageWrapper title={`#${String(orderInfo.number).padStart(6, '0')}`}>
      {content}
    </PageWrapper>
  );
};
