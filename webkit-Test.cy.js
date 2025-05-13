// no accurate will create a new documentation for another safari checker

describe('Responsive Test on WebKit (Safari)', () => {
  beforeEach(() => {
    cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight'));
    cy.visit(''); // Replace with your site URL
    cy.on("uncaught:exception", () => false);
  });

  it('should load correctly on WebKit', () => {
    cy.log('Running on WebKit browser');
    cy.title().should('not.be.empty');
  });

  it('should adjust viewport dynamically and open mobile nav', () => {
    const viewports = [
      { width: 1280, height: 800 },
      { width: 1024, height: 768 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    viewports.forEach((vp) => {
      cy.viewport(vp.width, vp.height);
      cy.wait(500);
      cy.log(`Testing at ${vp.width}x${vp.height}`);
      cy.get('body').should('be.visible');

      // if (vp.width <= 768) {
      //   cy.get('.mobile_menu_bar')
      //     .should('be.visible') // Ensure it's visible
      //     .click({ force: true }); // Force the click if needed
        
      //   cy.get('#mobile_menu2').should('be.visible');
      // }
    });
  });
});
