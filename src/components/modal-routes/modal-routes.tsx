import { FC } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { IngredientDetails, OrderInfo, Modal } from '@components';
import { ProtectedRoute } from '../protected-route';

const OrderInfoWrapper: FC = () => {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal
      title={`#${number?.padStart(6, '0')}`}
      onClose={() => window.history.back()}
    >
      <OrderInfo />
    </Modal>
  );
};

export const ModalRoutes: FC = () => (
  <Routes>
    <Route
      path='/ingredients/:id'
      element={
        <Modal title='Детали ингредиента' onClose={() => window.history.back()}>
          <IngredientDetails />
        </Modal>
      }
    />
    <Route path='/feed/:number' element={<OrderInfoWrapper />} />
    <Route
      path='/profile/orders/:number'
      element={<ProtectedRoute element={<OrderInfoWrapper />} />}
    />
  </Routes>
);
