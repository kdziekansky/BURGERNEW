// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Дополнительные команды для тестирования конструктора бургеров
Cypress.Commands.add('addIngredientToConstructor', (ingredientId: string) => {
  cy.get(`[data-testid="ingredient-${ingredientId}"]`).click();
});

Cypress.Commands.add('checkIngredientInConstructor', (ingredientId: string) => {
  cy.get(`[data-testid="constructor-ingredient-${ingredientId}"]`).should(
    'exist'
  );
});

// Команда для проверки булок в конструкторе
Cypress.Commands.add('checkBunInConstructor', (bunName: string) => {
  cy.get('[data-testid="constructor-bun-top"]').should('contain', bunName);
  cy.get('[data-testid="constructor-bun-bottom"]').should('contain', bunName);
});

// Команда для создания заказа
Cypress.Commands.add('createOrder', () => {
  cy.get('[data-testid="order-button"]').click();
  cy.wait('@createOrder');
});

// Объявление типов для TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Добавляет ингредиент в конструктор бургера
       * @param ingredientId - ID ингредиента
       * @example cy.addIngredientToConstructor('643d69a5c3f7b9001cfa093c')
       */
      addIngredientToConstructor(ingredientId: string): Chainable<Element>;

      /**
       * Проверяет наличие ингредиента в конструкторе
       * @param ingredientId - ID ингредиента
       * @example cy.checkIngredientInConstructor('643d69a5c3f7b9001cfa093c')
       */
      checkIngredientInConstructor(ingredientId: string): Chainable<Element>;

      /**
       * Проверяет наличие булок в конструкторе
       * @param bunName - Название булки
       * @example cy.checkBunInConstructor('Краторная булка N-200i')
       */
      checkBunInConstructor(bunName: string): Chainable<Element>;

      /**
       * Создает заказ, нажимая на кнопку "Оформить заказ"
       * @example cy.createOrder()
       */
      createOrder(): Chainable<Element>;
    }
  }
}

// Экспортируем пустой объект для импорта в других файлах
export {};
