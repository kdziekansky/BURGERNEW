import rootReducer from '../index';

describe('rootReducer', () => {
  it('должен возвращать корректное начальное состояние', () => {
    // Определяем предполагаемое начальное состояние
    const expectedState = {
      ingredients: {
        ingredients: [],
        ingredientsRequest: false,
        ingredientsFailed: false,
        error: null,
        selectedIngredient: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderData: null,
        orderRequest: false,
        orderFailed: false,
        error: null
      },
      auth: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      }
    };

    // Вызываем rootReducer с undefined состоянием и произвольным экшеном
    const actualState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что возвращаемое состояние соответствует ожидаемому
    expect(actualState).toEqual(expectedState);
  });
});
