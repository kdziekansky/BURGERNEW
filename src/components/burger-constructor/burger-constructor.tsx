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

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderData = useSelector(selectOrderData);
  const user = useSelector(selectUser);

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

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', {
        state: { from: { pathname: '/' } },
        replace: true
      });
      return;
    }

    const ingredientIds = constructorItems.ingredients.map((item) => item._id);

    if (constructorItems.bun) {
      ingredientIds.push(constructorItems.bun._id);
      ingredientIds.unshift(constructorItems.bun._id);
    }

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
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
