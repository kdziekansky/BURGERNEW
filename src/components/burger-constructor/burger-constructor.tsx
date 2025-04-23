// src/components/burger-constructor/burger-constructor.tsx
import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  selectConstructorItems,
  selectOrderData,
  selectOrderRequest,
  selectUser
} from '../../services/selectors';

import { createOrder } from '../../services/slices/order-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';
import { clearOrder } from '../../services/slices/order-slice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из хранилища
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderData = useSelector(selectOrderData);
  const user = useSelector(selectUser);

  // Подсчет общей стоимости бургера
  const price = useMemo(() => {
    const bunPrice =
      constructorItems.bun && constructorItems.bun.price
        ? constructorItems.bun.price * 2
        : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  // Создание заказа
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Проверяем авторизацию
    if (!user) {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      navigate('/login', {
        state: { from: { pathname: '/' } },
        replace: true
      });
      return;
    }

    // Создаем массив id ингредиентов для отправки на сервер
    const ingredientIds = constructorItems.ingredients.map((item) => item._id);

    // Добавляем булку в начало и конец (верх и низ)
    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
      ingredientIds.unshift(constructorItems.bun._id);
    }

    // Отправляем запрос на сервер
    dispatch(createOrder(ingredientIds));
  };

  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    dispatch(clearOrder());
    // Очищаем конструктор после успешного оформления заказа
    if (!orderRequest && orderData) {
      dispatch(clearConstructor());
    }
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderData?.order || null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
