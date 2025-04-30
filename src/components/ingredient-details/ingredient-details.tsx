import { FC } from 'react';
import { useSelector } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { selectIngredients } from '../../services/selectors';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { PageWrapper } from '../page-wrapper';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  const content = <IngredientDetailsUI ingredientData={ingredientData} />;
  const isModal = !!location.state?.background;

  return isModal ? (
    content
  ) : (
    <PageWrapper title='Детали ингредиента'>{content}</PageWrapper>
  );
};
