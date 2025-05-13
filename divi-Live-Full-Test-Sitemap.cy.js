describe('Check Featured Image and H1 Tag', () => {
  const sitemaps = [
    '' // can take mulple site maps

  ];

  function extractUrlsFromSitemap(sitemapUrl) {
    return cy.request(sitemapUrl).then((response) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.body, 'text/xml');
      return Array.from(xmlDoc.getElementsByTagName('loc')).map(el => el.textContent);
    });
  }

  it('should check if each page has one H1 tag and a featured image', () => {
    sitemaps.forEach((sitemap) => {
      extractUrlsFromSitemap(sitemap).then((urls) => {
        urls.forEach((url) => {
          cy.visit(url);
          cy.on('uncaught:exception', () => false);
          
          cy.document().then((doc) => {
            const hasOGImage = doc.querySelector('meta[property="og:image"]') !== null;
            const hasThumbnail = doc.querySelector('.has-post-thumbnail') !== null;
            const h1Tags = doc.querySelectorAll('h1');

            if (!hasOGImage && !hasThumbnail) {
              cy.log(`⚠️ Warning: No featured image found on ${url}`);
            } else {
              cy.log(`✅ Featured image detected on ${url}`);
            }

            if (h1Tags.length === 0) {
              cy.log(`❌ Error: No <h1> tag found on ${url}`);
            } else if (h1Tags.length > 1) {
              cy.log(`❌ Error: Multiple <h1> tags found (${h1Tags.length}) on ${url}`);
            } else {
              cy.log(`✅ One <h1> tag found on ${url}`);
            }
          });
        });
      });
    });
  });
});
