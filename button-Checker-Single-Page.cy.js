describe('Single Page Link Checker', () => {
  const testUrl = ''; // Replace with the URL you want to test
  let failedPage = null;
  let failedLinks = [];
  let missingNewTabLinks = [];

  it(`Visits and checks links on ${testUrl}`, () => {
    cy.request({ url: testUrl, failOnStatusCode: false }).then((response) => {
      if (response.status >= 400) {
        failedPage = { url: testUrl, status: response.status };
        return; // Skip further checks
      }

      cy.visit(testUrl, { failOnStatusCode: false }).then(() => {
        cy.on('uncaught:exception', () => false);

        cy.get('a').each(($el) => {
          const href = $el.attr('href');
          const text = $el.text().trim();
          const target = $el.attr('target');
          //links to ignore
          if (
            href &&
            !href.startsWith('#') &&
            !href.startsWith('mailto:') &&
            href !== '' &&
            href !== '' &&
            href !== ""
          ) {
            // Check if external link opens in new tab
            if (!href.includes(Cypress.config('baseUrl')) && target !== '_blank') {
              missingNewTabLinks.push({ testUrl, href, text });
            }

            cy.request({ url: href, failOnStatusCode: false }).then((resp) => {
              if (resp.status >= 400) {
                failedLinks.push({ testUrl, href, text, status: resp.status });
              }
            });
          }
        });
      });
    });
  });

  after(() => {
    if (failedPage) {
      cy.task('log', { failedPage });
    }
    if (failedLinks.length > 0) {
      cy.task('log', { failedLinks });
    }
    if (missingNewTabLinks.length > 0) {
      cy.task('log', { missingNewTabLinks });
    }
  });
});
