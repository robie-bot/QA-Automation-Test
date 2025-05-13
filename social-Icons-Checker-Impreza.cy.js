describe('Social Media Links Scan Across Multiple Sitemaps', () => {
  let urls = [
    "",// can take multiple sitemaps
    "",
    ""
  ];

  function parseSitemap(xmlBody) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlBody, 'application/xml');
    return [...xmlDoc.getElementsByTagName('loc')].map((el) => el.textContent);
  }

  before(() => {
    let allUrls = [];

    cy.wrap(urls).each((sitemapUrl) => {
      cy.request(sitemapUrl).then((response) => {
        const pageUrls = parseSitemap(response.body);
        allUrls.push(...pageUrls);
      });
    }).then(() => {
      urls = [...new Set(allUrls)]; // Remove duplicates
    });
  });

  it('Scans all pages for social media links', () => {
    cy.wrap(urls).each((pageUrl) => {
      cy.visit(pageUrl);
      cy.on("uncaught:exception", () => false); // Ignore JS errors

      cy.log(`Scanning page: ${pageUrl}`);

      const socialIcons = [
        { name: 'Facebook', selector: '.w-socials-item.facebook a' },
        { name: 'LinkedIn', selector: '.w-socials-item.linkedin a' },
        { name: 'Instagram', selector: '.w-socials-item.instagram a' },
        { name: 'YouTube', selector: '.w-socials-item.youtube a' },
      ];

      cy.wrap(socialIcons).each(({ name, selector }) => {
        cy.get('body').then(($body) => {
          if ($body.find(selector).length > 0) {
            cy.get(selector).invoke('attr', 'href').then((href) => {
              if (!href) {
                cy.log(`⚠️ ${name} icon on ${pageUrl} is missing an href.`);
              } else {
                cy.log(`✅ ${name} icon on ${pageUrl} found: ${href}`);
              }
            });
          } else {
            cy.log(`❌ ${name} icon missing on ${pageUrl}`);
          }
        });
      });
    });
  });
});
