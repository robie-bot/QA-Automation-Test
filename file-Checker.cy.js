describe('Check PDF Existence Across Pages', () => {
  beforeEach(() => {
    cy.visit('/'); // add url
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    });
  });

  it('Fetches all menu links and checks for PDF existence', () => {
    const pdfPath = '/wp-content/uploads/2025/02/WalkerBai-Capability-Statement_Master25.pdf'; // place file link
    const values = [];

    cy.get('.menu-item > a')
      .each(($el) => {
        const href = $el.attr('href');
        if (href) {
          values.push(href);
        }
      })
      .then(() => {
        cy.log('Pages to check: ' + JSON.stringify(values));

        values.forEach((page) => {
          cy.visit(page);
          cy.request(pdfPath).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
      });
  });
});
