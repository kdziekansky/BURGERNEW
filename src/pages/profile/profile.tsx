import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser, selectAuthError } from '../../services/selectors';
import { updateUser } from '../../services/slices/auth-slice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const error = useSelector(selectAuthError);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const originalValuesRef = useRef({
    name: '',
    email: '',
    password: ''
  });

  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const createPasswordMask = (length: number): string => '*'.repeat(length);

  const isPasswordMask = (value: string): boolean => /^\*+$/.test(value);

  useEffect(() => {
    if (user && !isFormInitialized) {
      const passwordLength = parseInt(
        localStorage.getItem('passwordLength') || '0',
        10
      );

      const userData = {
        name: user.name || '',
        email: user.email || '',
        password: passwordLength > 0 ? createPasswordMask(passwordLength) : ''
      };

      setFormValue(userData);
      originalValuesRef.current = userData;
      setIsFormInitialized(true);
    }
  }, [user, isFormInitialized]);

  useEffect(() => {
    if (!isFormInitialized) return;

    const changed =
      formValue.name !== originalValuesRef.current.name ||
      formValue.email !== originalValuesRef.current.email ||
      formValue.password !== originalValuesRef.current.password;

    setIsFormChanged(changed);
  }, [formValue, isFormInitialized]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validateEmail(formValue.email)) {
      setValidationError('Некорректный формат email');
      return;
    }

    setValidationError(null);

    const updatedData = {
      name: formValue.name,
      email: formValue.email,
      ...(formValue.password && !isPasswordMask(formValue.password)
        ? { password: formValue.password }
        : {})
    };

    try {
      await dispatch(updateUser(updatedData)).unwrap();

      if (formValue.password && !isPasswordMask(formValue.password)) {
        localStorage.setItem(
          'passwordLength',
          formValue.password.length.toString()
        );

        const passwordMask = createPasswordMask(formValue.password.length);
        setFormValue((prev) => ({
          ...prev,
          password: passwordMask
        }));

        originalValuesRef.current = {
          name: formValue.name,
          email: formValue.email,
          password: passwordMask
        };
      } else {
        originalValuesRef.current = {
          name: formValue.name,
          email: formValue.email,
          password: formValue.password
        };
      }

      setIsFormChanged(false);
    } catch {}
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({
      name: originalValuesRef.current.name,
      email: originalValuesRef.current.email,
      password: originalValuesRef.current.password
    });

    setIsFormChanged(false);
    setValidationError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setValidationError(null);
    }

    if (
      name === 'password' &&
      isPasswordMask(formValue.password) &&
      !isPasswordMask(value)
    ) {
      const newValue = value.replace(/\*+/g, '');

      setFormValue((prevState) => ({
        ...prevState,
        [name]: newValue
      }));
    } else {
      setFormValue((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  if (!isFormInitialized) {
    return null;
  }

  const displayError = validationError || error || undefined;

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={displayError}
    />
  );
};
