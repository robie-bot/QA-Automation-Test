describe('Extract image names from all pages via sitemap', () => {
  const sitemapUrl = ''; // Update with your sitemap URL
  let urls = [];

  before(() => {
    cy.request(sitemapUrl).then((response) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.body, 'application/xml');
      
      // Extract only webpage URLs (not media/image URLs)
      urls = Array.from(xmlDoc.querySelectorAll('url loc'))
        .map(el => el.textContent)
        .filter(url => !url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)); // Exclude direct image URLs
    });
  });

  it('Fetches all image names from each page', () => {
    urls.forEach((pageUrl) => {
      cy.visit(pageUrl);

      cy.get('img').each(($img) => {
        const imgSrc = $img.attr('src');
        if (imgSrc) {
          const imgName = imgSrc.split('/').pop(); // Extract the filename
          cy.log(`Image found: ${imgName}`);
        }
      });
    });
  });
});
