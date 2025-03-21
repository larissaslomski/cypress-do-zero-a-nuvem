const longText = Cypress._.repeat('texto muito longo ', 20)

//deveria ter um "payload" para não repetir codigo -> custom commands

describe('Central de Atendimento ao Cliente TAT', () => {

  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT') //should eh assertion, tem timeout de 4s
    // cy.title().should('not.eq', 'titulo errado')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Slomski')
    cy.get('#email').type('larissa.slomsky@gmail.com')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.get('button[type="submit"]').click() //o select era muito genérico

    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Slomski')
    cy.get('#email').type('larissa.slomskygmail.com')
    cy.get('#open-text-area').type('teste')
    cy.get('button[type="submit"]').click() 

    cy.get('.error').should('be.visible')
  })

  it('telefone contina vazio quando preenchido com um valor não numérico', () => {
    cy.get('#phone')
    .type('teste')
    .should('have.value', '')

  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Slomski')
    cy.get('#email').type('larissa.slomsky@gmail.com')
    cy.get('#open-text-area').type('teste')
    cy.get('#phone-checkbox').click()
    cy.get('button[type="submit"]').click() 

    cy.get('.error').should('be.visible') //deveria ser algo mais especifico?

  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click() 

    cy.get('.error').should('be.visible')
  })

  //USO DE CUSTOM COMMANDS

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFields()
    cy.get('button[type="submit"]').click() 

    cy.get('.success').should('be.visible') //verificações não é interessante ir pra custom commands 
  })

  //SELECIONANDO OPÇÕES EM CAMPOS DE SELEÇÃO SUSPENSA -> selects

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
    .select('YouTube')
    .should('have.value', 'youtube')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
    .select(1)
    .should('have.value', 'blog')
  })

  //SELECIONANDO RADIO INPUT

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"]').check('feedback')
    .should('have.value', 'feedback')
    // cy.get('input[type="radio"][value="feedback"]').check()
    // .should('be.checked')
  })

  it('marca todos atendimentos', () => {
    cy.get('input[type="radio"]')
    .each((tyoeOfService) => {
      cy.wrap(tyoeOfService)
      .check()
      .should('be.checked')
    })
  })
  

//SELECIONANDO CHECKBOX

it('marca todos checkboxes, depois desmarca o último', () => {
  cy.get('input[type="checkbox"]')
  .check()
  .should('be.checked')
  .last()
  .uncheck()
  .should('not.be.checked')
})

it('2 exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido', () => {
  cy.fillMandatoryFields()
  cy.get('#phone-checkbox').check()
  cy.get('button[type="submit"]').click() 

  cy.get('.error').should('be.visible') //deveria ser algo mais especifico?
})

//UPLOAD DE ARQUIVOS

it('seleciona um arquivo da pasta fixtures', () => {
  cy.get('#file-upload')
  .selectFile('cypress/fixtures/example.json')
  .should(input => {
    expect(input[0].files[0].name).to.equal('example.json')
  })
})

it.only('seleciona um arquivo simulando um drag-and-drop', () => {
  cy.get('#file-upload')
  .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
  .should(input => {
    expect(input[0].files[0].name).to.equal('example.json')
  })
})

})
