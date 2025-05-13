const sitemaps = [
  '', // can take mulple site maps
  ''
];

describe('Font Style Checker', () => {
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

  it('Checks typography styles on all pages', () => {
    cy.wrap(pages).each((page) => {
      cy.visit(page, { failOnStatusCode: false });
      cy.on('uncaught:exception', () => false);

      cy.document().then((doc) => {
        const elementsToCheck = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
        const results = {};

        elementsToCheck.forEach(tag => {
          results[tag] = [];
          doc.querySelectorAll(tag).forEach(el => {
            const styles = getComputedStyle(el);
            results[tag].push({
              text: el.innerText.trim().slice(0, 50), // Limit text preview to 50 chars
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              lineHeight: styles.lineHeight,
              color: styles.color,
            });
          });
        });

        cy.log(`Page: ${page}`, JSON.stringify(results, null, 2));
      });
    });
  });
});