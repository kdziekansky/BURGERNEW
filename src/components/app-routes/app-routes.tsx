import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';
import { AuthRoute } from '../auth-route';

type AppRoutesProps = {
  location: any;
};

export const AppRoutes: FC<AppRoutesProps> = ({ location }) => (
  <Routes location={location}>
    <Route path='/' element={<ConstructorPage />} />
    <Route path='/feed' element={<Feed />} />
    <Route path='/ingredients/:id' element={<IngredientDetails />} />
    <Route path='/feed/:number' element={<OrderInfo />} />

    <Route path='/login' element={<AuthRoute element={<Login />} />} />
    <Route path='/register' element={<AuthRoute element={<Register />} />} />
    <Route
      path='/forgot-password'
      element={<AuthRoute element={<ForgotPassword />} />}
    />
    <Route
      path='/reset-password'
      element={<AuthRoute element={<ResetPassword />} />}
    />

    <Route path='/profile' element={<ProtectedRoute element={<Profile />} />} />
    <Route
      path='/profile/orders'
      element={<ProtectedRoute element={<ProfileOrders />} />}
    />
    <Route
      path='/profile/orders/:number'
      element={<ProtectedRoute element={<OrderInfo />} />}
    />

    <Route path='*' element={<NotFound404 />} />
  </Routes>
);
