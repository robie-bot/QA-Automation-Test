describe('Book Now Button Test', () => {
  const sitemaps = [
    '', // Replace with actual sitemap URLs
    ''
  ];
  let pages = [];

  before(() => {
    sitemaps.forEach((sitemap) => {
      cy.request(sitemap).then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.body, "text/xml");
        const locElements = xmlDoc.getElementsByTagName("loc");

        Array.from(locElements).forEach((el) => {
          pages.push(el.textContent);
        });
      });
    });
  });

  it('should verify Book Now button on each page', () => {
    pages.forEach((page) => {
      cy.visit(page);
      cy.on('uncaught:exception', () => false);

      // Check if "Book Now" button is visible and clickable
      cy.get('.w-btn.us-btn-style_1.icon_atright').first().click();

      cy.wait(3000);

      // Optionally, check if clicking redirects to a booking page
      cy.url().should('include', '/call'); 
    });
  });
});
