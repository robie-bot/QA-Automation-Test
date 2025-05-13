describe('Fetch and Visit All Links on a Page', () => {
  it('Visits each link and goes back', () => {
    cy.visit(''); // Change this to your website's URL

    cy.get('a').then(($links) => {
      const hrefs = [];

      // Store all unique links (avoiding duplicates, empty links, or relative links starting with "/")
      $links.each((index, link) => {
        const href = link.getAttribute('href');
        if (
          href && 
          !href.startsWith('#') && 
          !href.startsWith('javascript:') && 
          !href === '/' &&            // Exclude single "/"
          !href.startsWith('/')       // Exclude any relative paths
        ) {
          hrefs.push(href);
        }
      });

      // Iterate through each valid link
      cy.wrap(hrefs).each((href) => {
        cy.visit(href);
        cy.wait(2000); // Optional: wait for 2 seconds for the page to load
        cy.go('back'); // Navigate back
        cy.wait(1000); // Optional: wait for 1 second before the next iteration
      });
    });
  });
});
