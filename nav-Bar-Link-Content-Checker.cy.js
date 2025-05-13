// for checking if the text is changed and has the same link (vice versa)
describe('Sitemap Link Validation', () => {
  it('Fetches multiple sitemaps and validates links and Our Policies presence', () => {
    const sitemapUrls = [
      '', // can take multiple sitemaps
      '',
    ];
    
    const targetLink = '/'; // target a specific link
    const targetText = 'Our Policies';
    
    sitemapUrls.forEach(sitemapUrl => {
      cy.request(sitemapUrl).then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.body, 'text/xml');
        const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(el => el.textContent);
        
        urls.forEach((url) => {
          cy.request({ url, failOnStatusCode: false }).then((pageResponse) => {
            if (pageResponse.status === 200) {
              cy.log(`✅ Page loaded successfully: ${url}`);
              
              const pageHtml = document.createElement('html');
              pageHtml.innerHTML = pageResponse.body;
              
              const hasTargetLink = pageHtml.querySelector(`a[href='${targetLink}']`);
              const hasTargetText = [...pageHtml.querySelectorAll('a')].some(el => el.textContent.includes(targetText));
              
              if (hasTargetLink && hasTargetText) {
                cy.log(`✅ Found "${targetText}" link on: ${url}`);
              } else {
                cy.log(`⚠️ Missing "${targetText}" link on: ${url}`);
              }
            } else {
              cy.log(`❌ Failed to load page (${pageResponse.status}): ${url}`);
            }
          });
        });
      });
    });
  });
});
