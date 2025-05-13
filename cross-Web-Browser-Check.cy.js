describe('Responsive Design Test', () => {
  const viewports = [
    { device: 'Desktop', width: 1280, height: 720 },
    { device: 'Tablet', width: 768, height: 1024 },
    { device: 'Mobile', width: 375, height: 812 }
  ];

  const browsers = ['chrome', 'firefox', 'webkit'];

  viewports.forEach(viewport => {
    browsers.forEach(browser => {
      it(`Checks responsiveness on ${viewport.device} with ${browser}`, () => {

        cy.visit('/'); // Adjust with your site URL
        cy.on('uncaught:exception', (err, runnable) => {
          return false;
        });
        cy.viewport(viewport.width, viewport.height);
        cy.wait(10000); // 10-second delay before running the test for each viewport

        // Example: Check if the menu toggles on mobile
        if (viewport.device === 'Tablet') {
          cy.get('.w-nav-control', { timeout: 5000 }).should('be.visible').click();
        }
      });
    });
  });
});
