import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectIngredients } from '../../services/selectors';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  // Получаем id ингредиента из URL
  const { id } = useParams<{ id: string }>();

  // Получаем все ингредиенты из стора
  const ingredients = useSelector(selectIngredients);

  // Находим нужный ингредиент по id
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
