describe('Sitemap Button & Link Checker', () => {
  const sitemaps = [
    "", //can take multiple sitemaps

  ];
  let allUrls = [];
  let failedLinks = [];
  let missingNewTabLinks = [];

  before(() => {
      cy.wrap(null).then(() => {
        cy.on('uncaught:exception', () => false);

          return Cypress.Promise.all(
              sitemaps.map(sitemap =>
                  cy.request({ url: sitemap, failOnStatusCode: false }).then(response => {
                      if (response.status === 200) {
                          try {
                              const parser = new DOMParser();
                              const xmlDoc = parser.parseFromString(response.body, 'text/xml');
                              const urls = [...xmlDoc.getElementsByTagName('loc')]
                                  .map(el => el.textContent)
                                  .filter(url => url !== '','' ); // Exclude specific link or page
                              allUrls = allUrls.concat(urls);
                          } catch (error) {
                              failedLinks.push({ url: sitemap, status: 'Parsing Error', error: error.message });
                          }
                      } else {
                          failedLinks.push({ url: sitemap, status: response.status || 'Unknown Error' });
                      }
                  })
              )
          );
      });
  });

  it('Checking all pages from sitemaps', () => {
      cy.wrap(allUrls).each((url) => {
          cy.visit(url, { failOnStatusCode: false }).then(() => {
            cy.on('uncaught:exception', () => false);
              cy.get('a').each(($el) => {
                  const href = $el.attr('href');
                  const text = $el.text().trim();
                  const target = $el.attr('target');
                // to ignore link on a page
                  if (href && !href.startsWith('#') && !href.startsWith('mailto:') && href !== '' && href !== ''  && href !== '') {
                      // Check if outbound link opens in new tab
                      if (!href.includes(Cypress.config('baseUrl')) && target !== '_blank') {
                          missingNewTabLinks.push({ url, href, text });
                      }

                      cy.request({ url: href, failOnStatusCode: false }).then((resp) => {
                          if (resp.status >= 400) {
                              failedLinks.push({ url, href, text, status: resp.status });
                          }
                      });
                  }
                  
              });
          });
      });
  });

  after(() => {
      if (failedLinks.length > 0) {
          cy.task('log', { failedLinks });
      }
      if (missingNewTabLinks.length > 0) {
          cy.task('log', { missingNewTabLinks });
      }
  });
});
