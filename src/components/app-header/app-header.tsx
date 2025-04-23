import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';

export const AppHeader: FC = () => {
  const user = useSelector(selectUser);
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};
