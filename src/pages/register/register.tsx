// src/pages/register/register.tsx
import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/auth-slice';
import { selectAuthError, selectIsLoading } from '../../services/selectors';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectIsLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      return;
    }

    dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        // После успешной регистрации перенаправляем на главную
        navigate('/', { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка регистрации:', err);
      });
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
