describe('Mobile Navbar Test', () => {
  const mobileMenuButton = '.mobile_nav'; // Adjust selector if needed
  const mobileMenu = '.mobile_menu_bar'; // Selector for the mobile menu

  beforeEach(() => {
    cy.viewport('iphone-x'); // Set viewport to a mobile size
    cy.visit('https://scaleandbones.sitesatscale.com/'); // Change to the correct site URL
    cy.on('uncaught:exception', () => false);

  });

  it('should open the mobile menu when clicked', () => {
    cy.get('.mobile_nav').invoke('addClass', 'opened');
    cy.get(mobileMenu).should('be.visible'); // Check if the menu is now visible
  });

  it('should work across multiple browsers', () => {
    const browsers = ['chrome', 'firefox', 'edge', 'webkit']; // Include WebKit
    browsers.forEach((browser) => {
      cy.task('runInBrowser', browser).then(() => {
        cy.viewport('iphone-x');
        cy.visit('https://scaleandbones.sitesatscale.com/');
        cy.get(mobileMenu).should('not.be.visible');
        cy.get(mobileMenuButton).click();
        cy.get(mobileMenu).should('be.visible');
      });
    });
  });
});
