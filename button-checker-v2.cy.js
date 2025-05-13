const fs = require('fs');
const path = 'cypress/fixtures/visited-urls.json';

describe('Sitemap Button & Link Checker', () => {
  const sitemaps = [
    "",//can take multiple site maps
  ];

  let allUrls = [];
  let failedLinks = [];
  let missingNewTabLinks = [];
  let visitedUrls = new Set();

  before(() => {
    cy.on('uncaught:exception', () => false);

    // Read visited URLs from JSON file
    cy.readFile(path, { timeout: 10000 }).then((data) => {
      visitedUrls = new Set(data);

      return Cypress.Promise.all(
        sitemaps.map(sitemap =>
          cy.request({ url: sitemap, failOnStatusCode: false }).then(response => {
            if (response.status === 200) {
              try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.body, 'text/xml');
                const urls = [...xmlDoc.getElementsByTagName('loc')]
                  .map(el => el.textContent)
                  .filter(url => //pages to ignore scan
                    url !== '' &&  
                    url !== ''
                  );
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
      if (!visitedUrls.has(url)) {
        visitedUrls.add(url); // Mark as visited

        cy.visit(url, { failOnStatusCode: false }).then(() => {
          cy.on('uncaught:exception', () => false);
          cy.get('a').each(($el) => {
            const href = $el.attr('href');
            const text = $el.text().trim();
            const target = $el.attr('target');
              // links to ignore in a page
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') &&
                href !== '' &&
                href !== '' &&
                href !== '' &&
                href !== ''
              
              ) {

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
      } else {
        cy.log(`Skipping already visited URL: ${url}`);
      }
    });
  });

  after(() => {
    if (failedLinks.length > 0) {
      cy.task('log', { failedLinks });
    }
    if (missingNewTabLinks.length > 0) {
      cy.task('log', { missingNewTabLinks });
    }

    // Save updated visited URLs to file
    const visitedArray = Array.from(visitedUrls);
    cy.writeFile(path, visitedArray, { log: true });
  });
});
