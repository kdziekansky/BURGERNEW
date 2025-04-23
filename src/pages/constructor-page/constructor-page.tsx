// src/pages/constructor-page/constructor-page.tsx

import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import {
  selectIngredients,
  selectIngredientsRequest
} from '../../services/selectors';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIngredientsRequest);
  const ingredients = useSelector(selectIngredients);

  // Загружаем ингредиенты при монтировании компонента
  useEffect(() => {
    console.log('ConstructorPage mounted, loading ingredients if needed');

    // Загружаем только если еще нет ингредиентов
    if (ingredients.length === 0 && !isIngredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients, isIngredientsLoading]);

  console.log('ConstructorPage render:', {
    isLoading: isIngredientsLoading,
    ingredientsCount: ingredients.length
  });

  // Отображаем загрузку только если загружаемся и еще нет ингредиентов
  const isLoading = isIngredientsLoading && ingredients.length === 0;

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
