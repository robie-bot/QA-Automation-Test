const path = 'cypress/fixtures/checked-links.json';

describe('Check all anchor links on the page with caching', () => {
  let checkedLinks = [];

  before(() => {
    // Load already checked links before test starts
    cy.readFile(path).then((links) => {
      checkedLinks = links || [];
    });
  });

  beforeEach(() => {
    cy.visit('');//Url for your staging website
  });

  it('should validate all <a> tags', () => {
    const ignoreLinks = [
      ""//Multiple to ignore links
    ];

    cy.get('a[href]').each(($a) => {
      const href = $a.prop('href');
      const target = $a.attr('target');
    
      if (!href.startsWith('http')) {
        cy.log(`Skipping non-http link: ${href}`);
        return;
      }
    
      if (ignoreLinks.includes(href)) {
        cy.log(`Skipping ignored link: ${href}`);
        return;
      }
    
      if (checkedLinks.includes(href)) {
        cy.log(`Already checked link, skipping: ${href}`);
        return;
      }
    
      // Highlight the link element
      cy.wrap($a).invoke('css', 'outline', '3px solid red');
    
      cy.wrap(null).then(() => {
        cy.location('origin').then((origin) => {
          const isInternal = href.startsWith(origin);
      
          if (isInternal && target === '_blank') {
            cy.log(`⚠️ Internal link opens in new tab: ${href}`);
          }
          if (!isInternal && target !== '_blank') {
            cy.log(`⚠️ External link does NOT open in new tab: ${href}`);
          }
        });
      
        // ⛑️ Catch network-level request errors like SSL failures
        Cypress.once('fail', (err) => {
          if (
            err.name === 'CypressError' &&
            err.message.includes('cy.request() failed')
          ) {
            cy.log(`❌ Network-level failure for: ${href}`);
            checkedLinks.push(href);
            cy.writeFile(path, checkedLinks);
            return false; // prevents test from failing
          }
      
          throw err; // rethrow other errors
        });
      
        cy.request({
          url: href,
          failOnStatusCode: false,
          timeout: 10000
        }).then((response) => {
          if (!response || !response.status) {
            cy.log(`❌ No response: ${href}`);
          } else if (response.status >= 400) {
            cy.log(`❌ Broken link: ${href} (Status ${response.status})`);
          } else {
            cy.log(`✅ Link OK: ${href} (Status ${response.status})`);
          }
      
          checkedLinks.push(href);
          cy.writeFile(path, checkedLinks);
        });
      });
      
    });
  });
});
