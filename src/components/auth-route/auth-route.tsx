import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser, selectIsAuthChecked } from '../../services/selectors';
import { Preloader } from '@ui';

type AuthRouteProps = {
  element: ReactElement;
};

export const AuthRoute: FC<AuthRouteProps> = ({ element }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return element;
};
