import reducer, {
  setSelectedIngredient,
  clearSelectedIngredient,
  TIngredientsState
} from '../ingredients-slice';
import { TIngredient } from '@utils-types';

describe('ingredients reducer', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    ingredientsRequest: false,
    ingredientsFailed: false,
    error: null,
    selectedIngredient: null
  };

  const mockIngredient: TIngredient = {
    _id: 'test-id',
    name: 'Тестовый ингредиент',
    type: 'main',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'image.png',
    image_mobile: 'mobile-image.png',
    image_large: 'large-image.png'
  };

  const mockIngredients: TIngredient[] = [mockIngredient];

  it('должен обрабатывать setSelectedIngredient', () => {
    const action = {
      type: setSelectedIngredient.type,
      payload: mockIngredient
    };
    const newState = reducer(initialState, action);

    expect(newState.selectedIngredient).toEqual(mockIngredient);
  });

  it('должен обрабатывать clearSelectedIngredient', () => {
    const stateWithSelectedIngredient = {
      ...initialState,
      selectedIngredient: mockIngredient
    };

    const action = { type: clearSelectedIngredient.type };
    const newState = reducer(stateWithSelectedIngredient, action);

    expect(newState.selectedIngredient).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    // Создаем вручную экшен с правильным типом
    const action = {
      type: 'ingredients/fetchIngredients/pending'
    };

    const newState = reducer(initialState, action);

    expect(newState.ingredientsRequest).toBe(true);
    expect(newState.ingredientsFailed).toBe(false);
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    // Создаем вручную экшен с правильным типом
    const action = {
      type: 'ingredients/fetchIngredients/fulfilled',
      payload: mockIngredients
    };

    const newState = reducer(initialState, action);

    expect(newState.ingredientsRequest).toBe(false);
    expect(newState.ingredientsFailed).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients);
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const mockError = 'Ошибка при загрузке ингредиентов';

    // Создаем вручную экшен с правильным типом
    const action = {
      type: 'ingredients/fetchIngredients/rejected',
      payload: mockError
    };

    const newState = reducer(initialState, action);

    expect(newState.ingredientsRequest).toBe(false);
    expect(newState.ingredientsFailed).toBe(true);
    expect(newState.error).toEqual(mockError);
  });
});
