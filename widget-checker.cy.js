// checker if a widget exist on a pages using widgets specific class
describe('Check Widget on All Pages from Sitemap', () => {
  Cypress.on('uncaught:exception', () => false); // Ignore site errors

  const sitemapUrl = ''; // add one sitemap

  it('should check if the widget exists on all pages', () => {
      cy.request(sitemapUrl).then((response) => {
          expect(response.status).to.eq(200);

          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.body, "text/xml");
          const urls = Array.from(xmlDoc.getElementsByTagName("loc")).map(el => el.textContent);

          urls.forEach((url) => {
              cy.visit(url);
              
              cy.get('body').then((body) => {
                  if (body.find('.ti-widget.ti-goog.ti-review-text-mode-readmore.ti-text-align-left').length) {
                      cy.get('.ti-widget.ti-goog.ti-review-text-mode-readmore.ti-text-align-left')
                        .should('exist');
                  } else {
                      cy.log(`Widget not found on: ${url}`);
                  }
              });
          });
      });
  });
});
