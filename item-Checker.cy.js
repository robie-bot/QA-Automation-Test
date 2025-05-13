describe('Check Image is Missing on Sitemap URLs', () => {
  const sitemapUrl = ''; // add sitemap
  const imageUrl = '/wp-content/uploads/2025/04/EFSFSG-15-04-2025.pdf'; // place file link

  it('Fetches all links from sitemap and checks if image is missing', () => {
    cy.request(sitemapUrl).then((response) => {
      expect(response.status).to.eq(200);

      // Parse XML to extract URLs
      const urls = [...response.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

      // Limit URLs for testing (remove `.slice(0, 10)` to check all pages)
      cy.wrap(urls.slice(0, 10)).each((url) => {
        cy.visit(url);
        cy.on('uncaught:exception', () => false); // Prevents test failure on page errors

        // Scroll to the bottom to trigger lazy-loading
        cy.scrollTo('bottom');
        cy.wait(2000); // Allow images to load

        // Check if the image exists without failing the test
        cy.document().then((doc) => {
          const imgExists = doc.querySelector(`a[href="${imageUrl}"]`);
          
          if (imgExists) {
            cy.log(`✅ Image exists on: ${url}`);
            console.log(`✅ Image still exists on: ${url}`);
          } else {
            cy.log(`❌ Image is missing on: ${url}`);
            console.log(`❌ Image is missing on: ${url}`);
          }
        });
      });
    });
  });
});
