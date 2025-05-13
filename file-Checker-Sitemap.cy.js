describe('Check PDF Existence Across Multiple Sitemaps', () => {
  const sitemaps = [
    '/',// can take multiple sitemaps
];

const pdfPath = '/wp-content/uploads/2025/03/RecitalSurvivalGuide2024-25.pdf'; // place file link
let pageUrls = [];

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
  });

  it('Fetches all sitemap links and checks for PDF existence', () => {
    cy.wrap(sitemaps).each((sitemap) => {
      cy.request(sitemap).then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.body, 'text/xml');
        const locElements = xmlDoc.getElementsByTagName('loc');

        Array.from(locElements).forEach((el) => {
          pageUrls.push(el.textContent);
        });
      });
    }).then(() => {
      cy.log('Pages to check: ' + JSON.stringify(pageUrls));
      cy.wrap(pageUrls).each((page) => {
        cy.visit(page);
        
        // Check if the PDF link exists and if it opens in a new tab
        cy.get(`a[href='${pdfPath}']`).then(($link) => {
          if ($link.length) {
            cy.wrap($link).should('have.attr', 'target', '_blank');
          }
        });
        
        // Verify the PDF file exists by making a request
        cy.request(pdfPath).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });
  });
