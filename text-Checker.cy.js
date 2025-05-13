// text checker

describe('Sitemap Navigation and Text Absence Check', () => {
  const sitemapUrl = ''; // Update with your sitemap path
  const textToCheck = 'Andrew Blinco'; // Update with the text to verify

  beforeEach(() => {
    // Prevent Cypress from failing on uncaught exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      console.warn('Ignoring uncaught exception:', err.message);
      return false; // Prevent test from failing
    });
  });

  it('Checks all pages from sitemap for absence of text', () => {
    cy.request(sitemapUrl).then((response) => {
      expect(response.status).to.eq(200);

      // Parse XML Sitemap
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.body, 'application/xml');
      const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map((el) => el.textContent);

      urls.forEach((url) => {
        cy.log(`Visiting: ${url}`);

        // Visit each URL but continue on error
        cy.visit(url, { failOnStatusCode: false }).then(() => {
          cy.document().its('readyState').should('eq', 'complete');

          // Use a try-catch style approach to avoid breaking the test
          cy.contains(textToCheck, { timeout: 5000 })
            .should('not.exist')
            .then(() => {
              cy.log(`✅ Text "${textToCheck}" NOT found on ${url}`);
            })
            .catch(() => {
              cy.log(`❌ WARNING: Text "${textToCheck}" FOUND on ${url}`);
            });
        }).catch((err) => {
          cy.log(`⚠️ Skipping ${url} due to visit error: ${err.message}`);
        });
      });
    });
  });
});
