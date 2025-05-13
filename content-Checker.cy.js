describe('Luxe Clean Group Sitemap Link Validator', () => {
    const sitemaps = [
        "", //can take multiple sitemaps

    ];

    // List of pages or partial matches to ignore
    const ignoreUrls = [
  
    ];

    it('Fetches links from multiple sitemaps and checks content', () => {
        const missingTextPages = [];
        const foundTextPages = [];

        Cypress._.each(sitemaps, (sitemap) => {
            cy.log(`🔍 Fetching Sitemap: ${sitemap}`);
            cy.request(sitemap).then((response) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(response.body, 'text/xml');
                const locElements = xmlDoc.getElementsByTagName('loc');
                let urls = Array.from(locElements).map(el => el.textContent);

                // Filter out ignored URLs
                urls = urls.filter(url => !ignoreUrls.some(ignored => url.includes(ignored)));

                cy.log(`📄 ${urls.length} URLs to check after ignoring`);

                Cypress._.each(urls, (url) => {
                    cy.log(`🌐 Visiting: ${url}`);
                    cy.intercept('**/*.{png,jpg,jpeg,gif,webp,mp4,woff2,ttf,css}', { statusCode: 403 });
                    cy.visit(url, { failOnStatusCode: false });

                    cy.on('uncaught:exception', () => false);

                    cy.document().its('body.innerText').then((text) => {
                        if (!text.trim()) {
                            cy.log(`⚠️ Warning: Page content is empty for ${url}`);
                        }
                    });

                    cy.get('body').then(($body) => {
                        if ($body.text().includes("Book Training")) {
                            foundTextPages.push(url);
                            cy.log(`✅ Text found on: ${url}`);
                        } else {
                            missingTextPages.push(url);
                            cy.log(`❌ Text missing on: ${url}`);
                        }
                    });
                });
            });
        });

        cy.then(() => {
            cy.log(`📌 Total Sitemaps Processed: ${sitemaps.length}`);
            cy.log(`✅ Pages with text: ${foundTextPages.length}`);
            if (missingTextPages.length > 0) {
                cy.log(`⚠️ Pages missing text: ${missingTextPages.join(', ')}`);
            }
        });
    });
});
