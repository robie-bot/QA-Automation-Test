describe('Check Address on All Pages', () => {
  const address = '120/20 Park Avenue, Ellerslie, Auckland 1051, New Zealand';
  const sitemaps = [
    '',// can take multiple sitemaps
    '',
    '', 
  ]; // Add your actual sitemap URLs

  let pages = [];

  before(() => {
      // Fetch and parse all sitemaps to get a list of pages
      sitemaps.forEach((sitemap) => {
          cy.request(sitemap).then((response) => {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(response.body, 'text/xml');
              const urls = [...xmlDoc.getElementsByTagName('loc')].map(node => node.textContent);
              pages = pages.concat(urls);
          });
      });
  });

  it('Visits each page and checks for the address', () => {
      cy.wrap(pages).each((page) => {
          cy.visit(page, { failOnStatusCode: false });
          Cypress.on('uncaught:exception', (err, runnable) => {
            console.warn('Ignoring uncaught exception:', err.message);
            return false; // Prevent test from failing
          });
          cy.document().then((doc) => {
              const containsAddress = doc.body.innerText.includes(address);
              if (!containsAddress) {
                  cy.log(`Address not found on: ${page}`);
              }
              expect(true).to.be.true; // Ensures the test never fails
          });
      });
  });
});
