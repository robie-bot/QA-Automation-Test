const sitemaps = [
  "", // can take multiple sitemaps

];

describe('Font Family Checker', () => {
  let pages = [];

  before(() => {
    cy.wrap(sitemaps).each((sitemap) => {
      cy.request(sitemap).then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.body, 'text/xml');
        const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(el => el.textContent);
        pages = [...pages, ...urls];
      });
    });
  });

  it('Checks font-family on all pages', () => {
    cy.wrap(pages).each((page) => {
      cy.visit(page, { failOnStatusCode: false });
      cy.on('uncaught:exception', () => false);

      cy.document().then((doc) => {
        const styles = getComputedStyle(doc.body);
        const fonts = new Set([styles.fontFamily]);

        doc.querySelectorAll('*').forEach(el => {
          fonts.add(getComputedStyle(el).fontFamily);
        });

        cy.log(`Page: ${page} - Fonts: ${Array.from(fonts).join(', ')}`);
      });
    });
  });
});
