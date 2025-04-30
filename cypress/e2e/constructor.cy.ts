describe('Конструктор бургеров', () => {
  beforeEach(() => {
    // Перехватываем запрос ингредиентов и возвращаем моковые данные
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Перехватываем запрос авторизации
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Перехватываем запрос создания заказа
    cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Устанавливаем токены авторизации
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'test-accessToken');
        win.localStorage.setItem('refreshToken', 'test-refreshToken');
      }
    });

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем токены авторизации
    cy.clearLocalStorage();
  });

  it('должен добавлять булки в конструктор', () => {
    // Находим булку и кликаем на нее
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').should(
      'exist'
    );
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').click();

    // Проверяем, что булка добавлена в конструктор (сверху и снизу)
    cy.get('[data-testid="constructor-bun-top"]').should(
      'contain',
      'Краторная булка N-200i (верх)'
    );
    cy.get('[data-testid="constructor-bun-bottom"]').should(
      'contain',
      'Краторная булка N-200i (низ)'
    );
  });

  it('должен добавлять начинку в конструктор', () => {
    // Находим начинку и кликаем на нее
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]').should(
      'exist'
    );
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]').click();

    // Проверяем, что начинка добавлена в конструктор
    cy.get(
      '[data-testid="constructor-ingredient-643d69a5c3f7b9001cfa0941"]'
    ).should('contain', 'Биокотлета из марсианской Магнолии');
  });

  it('должен открывать и закрывать модальное окно с описанием ингредиента', () => {
    // Находим ингредиент и открываем его подробное описание
    cy.get('[data-testid="ingredient-link-643d69a5c3f7b9001cfa093c"]').click();

    // Проверяем, что модальное окно открылось и содержит нужные данные
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="ingredient-details"]').should(
      'contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-testid="ingredient-details"]').should(
      'contain',
      'Калории, ккал'
    );
    cy.get('[data-testid="ingredient-details"]').should('contain', '420');

    // Закрываем модальное окно по клику на крестик
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Снова открываем модальное окно для теста закрытия через оверлей
    cy.get('[data-testid="ingredient-link-643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[data-testid="modal"]').should('exist');

    // Закрываем модальное окно по клику на оверлей
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен создавать заказ и отображать модальное окно с номером', () => {
    // Добавляем булку и начинку в конструктор
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[data-testid="ingredient-643d69a5c3f7b9001cfa0941"]').click();

    // Кликаем на кнопку оформления заказа
    cy.get('[data-testid="order-button"]').click();

    // Ждем создания заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно с номером заказа открылось
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="order-number"]').should('contain', '12345');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // Проверяем, что конструктор пуст после создания заказа
    cy.get('[data-testid="constructor-bun-top"]').should('not.exist');
    cy.get('[data-testid="constructor-ingredients"]').should('be.empty');
    cy.get('[data-testid="constructor-bun-bottom"]').should('not.exist');
  });
});
