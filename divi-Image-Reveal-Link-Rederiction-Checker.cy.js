describe('Check dynamically inserted links', () => {
  beforeEach(() => {
    cy.visit(''); // Ensure correct URL
  });

  it('should verify each clickable element redirects correctly', () => {
    cy.get('.et_clickable').each(($el) => {
      const id = $el.id; // Access native DOM property

      if (!id) return; // Skip if no ID

      cy.get(`#${id}`).should('exist').click(); // Click the element
      cy.location('pathname').should('not.eq', '/sectors/'); // Ensure navigation

      cy.go('back'); // Return to the previous page
      cy.get('.et_clickable').should('exist'); // Ensure elements are still loaded
    });
  });
});
