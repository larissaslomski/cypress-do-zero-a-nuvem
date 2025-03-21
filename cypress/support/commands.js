Cypress.Commands.add('fillMandatoryFields', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Slomski')
    cy.get('#email').type('larissa.slomsky@gmail.com')
    cy.get('#open-text-area').type('teste')
})

