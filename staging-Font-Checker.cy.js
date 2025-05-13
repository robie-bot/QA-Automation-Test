describe('Validate font styles across menu pages', () => {
  beforeEach(() => {
    cy.visit(''); // add staging page link
    cy.on('uncaught:exception', () => false); // Ignore exceptions
  });

  it('Checks font styles on all menu pages', () => {
    const pages = new Set(); // Use a set to store unique page links

    // Collect all menu links
    cy.get('.menu-item > a').each(($el) => {
      const href = $el.attr('href');
      if (href && !href.includes('#') && href.toLowerCase() !== 'null') {
        const absoluteUrl = href.startsWith('http') ? href : Cypress.config('baseUrl') + href;
        pages.add(absoluteUrl);
      }
    }).then(() => {
      cy.wrap(Array.from(pages)).each((page) => {
        cy.visit(page, { failOnStatusCode: false });
        cy.on('uncaught:exception', () => false);

        cy.document().then((doc) => {
          const fontStyles = {};
          const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
          
          headingTags.forEach(tag => {
            fontStyles[tag] = new Set();
          });

          doc.querySelectorAll('*').forEach(el => {
            const style = getComputedStyle(el);
            const fontSize = style.getPropertyValue('font-size');
            const lineHeight = style.getPropertyValue('line-height');
            const fontWeight = style.getPropertyValue('font-weight');
            const fontInfo = `Font Family: ${style.fontFamily}, Font Size: ${fontSize}, Line Height: ${lineHeight}, Font Weight: ${fontWeight}`;
            if (headingTags.includes(el.tagName)) {
              fontStyles[el.tagName].add(fontInfo);
            }
          });
          
          Object.entries(fontStyles).forEach(([tag, styles]) => {
            if (styles.size > 0) {
              cy.log(`Page: ${page} - ${tag} Styles: ${Array.from(styles).join(' | ')}`);
            }
          });
        });
      });
    });
  });
});
