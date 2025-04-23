// src/pages/login/login.tsx
import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/auth-slice';
import { selectAuthError, selectIsLoading } from '../../services/selectors';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectIsLoading);

  // Получаем путь, с которого пользователь был перенаправлен
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        // После успешного логина перенаправляем на предыдущую страницу или на главную
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка авторизации:', err);
      });
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
