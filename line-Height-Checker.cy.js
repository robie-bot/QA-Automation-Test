describe('Check <li> inside <ol> has 1.8em font size', () => {
  const urls = [
    ""// can take multiple url's not sitemap

  ];

  urls.forEach((url) => {
    it(`Checks <li> inside <ol> has font size 1.8em on ${url}`, () => {
      cy.visit(url);
      cy.get('body').then(($body) => {
        if ($body.find('ol > li').length) {
          cy.get('ol > li').each(($el) => {
            cy.wrap($el).should('have.css', 'font-size', '1.8em');
          });
        } else {
          cy.log('No <ol> found on this page');
        }
      });
    });
  });
});