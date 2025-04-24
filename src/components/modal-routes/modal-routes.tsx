import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { IngredientDetails, OrderInfo, Modal } from '@components';
import { ProtectedRoute } from '../protected-route';

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
    <Route
      path='/feed/:number'
      element={
        <Modal title='Детали заказа' onClose={() => window.history.back()}>
          <OrderInfo />
        </Modal>
      }
    />
    <Route
      path='/profile/orders/:number'
      element={
        <ProtectedRoute
          element={
            <Modal title='Детали заказа' onClose={() => window.history.back()}>
              <OrderInfo />
            </Modal>
          }
        />
      }
    />
  </Routes>
);
