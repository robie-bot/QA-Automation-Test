describe('Validate all links and buttons', () => {
  beforeEach(() => {
    cy.visit(''); // add staging link 
    cy.on('uncaught:exception', () => false); // Ignore exceptions
  });

  it('should check all menu links and buttons', () => {
    const links = [];
    const brokenLinks = [];
    const redirectedLinks = [];
    const emptyButtons = [];
    const hashLinks = [];

    // Collect all menu links
    cy.get('.menu-item > a').each(($el) => {
      const href = $el.attr('href');

      if (!href) {
        cy.log(`⚠️ Empty link found: ${$el.text()}`);
      } else if (href === '#') {
        cy.log(`⚠️ Placeholder link (#) found: ${$el.text()}`);
        hashLinks.push($el.text().trim() || '[Unnamed Link]');
      } else {
        links.push(href);
      }
    });

    // Collect all buttons
    cy.get('button, a.button').each(($el) => {
      const href = $el.attr('href');

      if (href) {
        if (href === '#') {
          cy.log(`⚠️ Placeholder button (#) found: ${$el.text()}`);
          hashLinks.push($el.text().trim() || '[Unnamed Button]');
        } else {
          links.push(href);
        }
      } else {
        const buttonText = $el.text().trim();
        emptyButtons.push(buttonText || '[Unnamed Button]');
      }
    });

    // Log any empty buttons
    cy.then(() => {
      if (emptyButtons.length > 0) {
        cy.log('⚠️ Empty buttons found:', JSON.stringify(emptyButtons));
      }
      if (hashLinks.length > 0) {
        cy.log('⚠️ Placeholder (#) links/buttons found:', JSON.stringify(hashLinks));
      }
    });

    // Visit each link and check its status
    cy.then(() => {
      cy.wrap(links).each((link) => {
        cy.request({ url: link, failOnStatusCode: false }).then((response) => {
          const status = response.status;

          if (status === 200) {
            cy.log(`✅ Good link: ${link}`);
            cy.visit(link);
            cy.url().should('include', link);
            cy.get('body').should('not.be.empty');
          } else if (status >= 300 && status < 400) {
            cy.log(`🔄 Redirected link: ${link} (Status: ${status})`);
            redirectedLinks.push({ link, status });
          } else if (status >= 400) {
            cy.log(`❌ Broken link: ${link} (Status: ${status})`);
            brokenLinks.push({ link, status });
          }
        });
      });
    });

    // Log broken and redirected links at the end
    cy.then(() => {
      if (redirectedLinks.length > 0) {
        cy.log('🔄 Redirected links:', JSON.stringify(redirectedLinks, null, 2));
      }
      if (brokenLinks.length > 0) {
        cy.log('🚨 Broken links detected:', JSON.stringify(brokenLinks, null, 2));
      }
    });
  });
});
