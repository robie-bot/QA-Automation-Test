describe('Check if a link exists in all pages of multiple sitemaps', () => {
  const sitemaps = [
    "", // Add more sitemaps if needed
  ];
  const linkToCheck = 'https://www.amazon.com.au/';

  sitemaps.forEach((sitemap) => {
      it(`Checking pages inside ${sitemap}`, () => {
          cy.request(sitemap).then((response) => {
              expect(response.status).to.eq(200); // Ensure the sitemap loads

              // Parse XML and extract only HTML URLs
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(response.body, 'application/xml');
              let urls = Array.from(xmlDoc.querySelectorAll('url loc')).map(el => el.textContent);

              // Filter out non-HTML pages (images, PDFs, etc.)
              urls = urls.filter(url => url.endsWith('.html') || !url.match(/\.(png|jpg|jpeg|gif|pdf|xml|zip|mp4|mp3|webp)$/));

              cy.log(`Found ${urls.length} HTML pages in ${sitemap}`);

              urls.forEach((pageUrl) => {
                  cy.visit(pageUrl, { failOnStatusCode: false }); // Visit each valid HTML page
                  cy.on('uncaught:exception', () => false); // Prevents test failure on page errors

                  cy.get('body').then((body) => {
                      if (body.find(`a[href="${linkToCheck}"]`).length > 0) {
                          cy.log(`✅ Link found on ${pageUrl}`);
                      } else {
                          cy.log(`❌ Link NOT found on ${pageUrl}`);
                      }
                  });
              });
          });
      });
  });
});
