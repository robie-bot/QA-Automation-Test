// to check texts on the header

describe('Check if "Sat 7am - 1pm" exists in subheader across multiple sitemaps', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false); // Prevent test failures due to uncaught exceptions
  });

  it('Visits all pages from multiple sitemaps and logs missing text', () => {
    const sitemaps = [
      "",// can take multiple sitemaps
      "",

    ];
    
    let allUrls = [];

    // Fetch all sitemaps
    cy.wrap(sitemaps).each((sitemap) => {
      cy.request(sitemap).then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.body, 'text/xml');
        const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(el => el.textContent);

        allUrls = allUrls.concat(urls);
      });
    }).then(() => {
      // Visit each URL and check for the text
      cy.wrap(allUrls).each((url) => {
        cy.visit(url);

        cy.get('.l-subheader')
          .then(($subheader) => {
            if (!$subheader.text().includes('Sat 7am - 1pm')) {
              cy.log(`Missing on: ${url}`);
            }
          });
      });
    });
  });
});
