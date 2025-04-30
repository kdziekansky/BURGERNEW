import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructor-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('constructor reducer', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: 'bun-id',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 100,
    image: 'bun-image.png',
    image_mobile: 'bun-mobile-image.png',
    image_large: 'bun-large-image.png'
  };

  const mockIngredient: TConstructorIngredient = {
    _id: 'ingredient-id',
    id: 'unique-id-1',
    name: 'Тестовый ингредиент 1',
    type: 'main',
    proteins: 50,
    fat: 60,
    carbohydrates: 70,
    calories: 80,
    price: 200,
    image: 'ingredient-image.png',
    image_mobile: 'ingredient-mobile-image.png',
    image_large: 'ingredient-large-image.png'
  };

  const mockIngredient2: TConstructorIngredient = {
    ...mockIngredient,
    _id: 'ingredient-id-2',
    id: 'unique-id-2',
    name: 'Тестовый ингредиент 2'
  };

  it('должен обрабатывать addBun', () => {
    const action = { type: addBun.type, payload: mockBun };
    const newState = reducer(initialState, action);

    expect(newState.bun).toEqual(mockBun);
    expect(newState.ingredients).toEqual([]);
  });

  it('должен обрабатывать addIngredient', () => {
    const action = { type: addIngredient.type, payload: mockIngredient };
    const newState = reducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toEqual([mockIngredient]);
  });

  it('должен обрабатывать removeIngredient', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [mockIngredient]
    };

    const action = { type: removeIngredient.type, payload: 'unique-id-1' };
    const newState = reducer(stateWithIngredient, action);

    expect(newState.ingredients).toEqual([]);
  });

  it('должен обрабатывать moveIngredient', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [mockIngredient, mockIngredient2]
    };

    const action = {
      type: moveIngredient.type,
      payload: { dragIndex: 0, hoverIndex: 1 }
    };

    const newState = reducer(stateWithIngredients, action);

    // Проверяем, что ингредиенты поменялись местами
    expect(newState.ingredients[0]).toEqual(mockIngredient2);
    expect(newState.ingredients[1]).toEqual(mockIngredient);
  });

  it('должен обрабатывать clearConstructor', () => {
    const stateWithItems = {
      bun: mockBun,
      ingredients: [mockIngredient, mockIngredient2]
    };

    const action = { type: clearConstructor.type };
    const newState = reducer(stateWithItems, action);

    expect(newState).toEqual(initialState);
  });
});
