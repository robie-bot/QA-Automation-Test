describe('Sports Facility Maintenance Page Content Test', () => {
  beforeEach(() => {
      cy.visit(''); // Replace with actual URL
  });

  it('should contain key content phrases', () => {
    cy.contains('Most Mistakes in Sports Facility Maintenance (And How to Prevent Them!)').should('be.visible');
    cy.contains('What is a Sports Facility?').should('be.visible');
    cy.contains('What is Sports Facility Management, and Who is Responsible for It?').should('be.visible');
    cy.contains('How to Avoid Maintenance Mistakes in Your Facilities').should('be.visible');
});

it('should contain important content snippets', () => {
    cy.contains('A sports facility is any venue for athletic activities, including stadiums, arenas, indoor courts, outdoor fields, swimming pools, and gymnasiums.').should('be.visible');
    cy.contains('Sports facility management involves overseeing a sports venue\'s operation, maintenance, and safety.').should('be.visible');
    cy.contains('Overlooking Small Damages That Lead to Costly Repairs').should('be.visible');
    cy.contains('Using Incorrect Cleaning Products on Surfaces').should('be.visible');
    cy.contains('Neglecting Ventilation and Lighting Systems').should('be.visible');
    cy.contains('Failing to Maintain Automated and Electronic Systems').should('be.visible');
    cy.contains('Managing Drainage and Weather-Related Challenges').should('be.visible');
    cy.contains('Maximise Your Sports Equipment Storage to Help You Manage Your Facility Better').should('be.visible');
});

it('should check links are present', () => {
    cy.get('a[href="http://www.rmasport.com.au/"]').should('be.visible');
    cy.get('a[href*="linkedin.com"]').should('have.length.at.least', 1);
});
});
