// this script is to check a text if it is changed on the navbar
describe('Ensure a word does NOT exist in the header on Sitemap URLs', () => {
  const sitemapUrl = ''; // add sitemap
  const targetText = '12-week challenge'; // Change this to the text you're checking

  it('Fetches all links from the sitemap and fails if the text exists in the header', () => {
    cy.request(sitemapUrl).then((response) => {
      expect(response.status).to.eq(200);

      // Extract URLs from XML sitemap
      const urls = [...response.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

      // Iterate through all pages from the sitemap
      cy.wrap(urls).each((url) => {
        cy.visit(url, { failOnStatusCode: false });

        // Ensure the page loads before checking for the header text
        cy.document().should('exist');

        // Check if the header contains the target text
        cy.get('header').should('not.contain.text', targetText);
      });
    });
  });
});
