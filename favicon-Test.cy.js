describe('Is Favicon is available', () => {
  it('assert favicon', () => {
    cy.visit('').document().its('head').find('link[rel="icon"]').should('have.attr', 'href'); // add url
    cy.wait(2500).then(cy.screenshot({ capture: 'fullPage' }));

   });
})