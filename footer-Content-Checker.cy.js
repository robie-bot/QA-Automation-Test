// to check footer contents 

describe('Sitemap Footer Test', () => {
  const sitemaps = [
    '', // can take multiple sitemaps
    '', 

    ]; 
  let allPages = [];

  before(() => {
      cy.wrap(sitemaps).each((sitemap) => {
          cy.request(sitemap).then((response) => {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(response.body, 'text/xml');
              const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(el => el.textContent);
              
              allPages = allPages.concat(urls);
          });
      }).then(() => {
          cy.wrap(allPages).as('pages');
      });
  });

  it('Visits all pages and checks footer content', function () {
      this.pages.forEach((page) => {
          cy.visit(page);
          cy.log(`Visiting: ${page}`);
          cy.on('uncaught:exception', () => false);

          // Check if footer exists
          cy.get('body').then(($body) => {
            if ($body.find('#main-footer').length) {
              cy.get('#main-footer').within(() => {
                  // Check for phone number existence
                  cy.contains('02 4226 2522').should('exist').then(($phoneEl) => {
                      if (!$phoneEl.length) {
                          cy.log(`Missing: 02 4226 2522 on ${page}`);
                      } else {
                          // Ensure the phone number is wrapped in an <a> tag with a proper href
                          cy.wrap($phoneEl).closest('a').should('have.attr', 'href').then((href) => {
                              expect(href).to.not.include(' ');
                              expect(href).to.not.include('%20');
                          });
                      }
                  });
              });
          } else {
                  cy.log(`Footer missing on ${page}`);
              }
          });
      });
  });
});
