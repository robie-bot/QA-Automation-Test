const sitemapUrls = [
  '', // can take multiple sitemaps

];

const viewports = ['macbook-15', [1024, 1366], [600, 1024], 'iphone-xr', 'iphone-6'];

function parseSitemap(sitemapUrl) {
  return cy.request(sitemapUrl).then((response) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.body, "text/xml");
    const locElements = xmlDoc.querySelectorAll("url > loc");
    return Array.from(locElements).map(el => el.textContent);
  });
}

sitemapUrls.forEach((sitemapUrl) => {
  describe(`Soft checks for sitemap: ${sitemapUrl}`, () => {
    it('should audit all pages from the sitemap', () => {
      parseSitemap(sitemapUrl).then((urls) => {
        Cypress._.each(urls, (pageUrl) => {
          cy.log(`🔍 Visiting: ${pageUrl}`);
          cy.visit(pageUrl, { failOnStatusCode: false });
          cy.on('uncaught:exception', () => false);

          // --- Check og:image or featured image ---
          cy.document().then((doc) => {
            const ogImage = doc.querySelector('meta[property="og:image"]');
            if (!ogImage || !ogImage.content.startsWith('http')) {
              cy.log(`⚠️ Missing or invalid og:image`);
              console.warn(`⚠️ [${pageUrl}] Missing or invalid og:image`);
            }
          });

          // --- Check H1 presence ---
          cy.document().then((doc) => {
            const h1s = doc.querySelectorAll('h1');
            const h1Count = h1s.length;
            if (h1Count === 0) {
              cy.log(`⚠️ No <h1> found`);
              console.warn(`⚠️ [${pageUrl}] No <h1> found`);
            } else if (h1Count > 1) {
              cy.log(`⚠️ Found ${h1Count} <h1> tags`);
              console.warn(`⚠️ [${pageUrl}] Found ${h1Count} <h1> tags`);
            } else {
              const h1Visible = Cypress.$(h1s[0]).is(':visible');
              if (!h1Visible) {
                cy.log(`⚠️ H1 exists but not visible`);
                console.warn(`⚠️ [${pageUrl}] H1 not visible`);
              }
            }
          });

          // --- Check all image alts ---
          cy.get('img').each(($img) => {
            const src = $img.prop('src');
            const alt = $img.attr('alt');
            if (!alt) {
              cy.log(`⚠️ Missing alt on image: ${src}`);
              console.warn(`⚠️ [${pageUrl}] Missing alt on: ${src}`);
            }
          });

          // --- Image size check ---
          cy.get('img').each(($img) => {
            const imgSrc = $img.prop('src');
            if (imgSrc) {
              cy.request({ url: imgSrc, failOnStatusCode: false }).then((res) => {
                if (res.status === 404) {
                  cy.log(`❌ 404 Image: ${imgSrc}`);
                  console.error(`❌ [${pageUrl}] 404 image: ${imgSrc}`);
                } else {
                  const sizeKB = Number(res.headers['content-length']) / 1024;
                  if (sizeKB > 300) {
                    cy.log(`❗ Large image (${sizeKB.toFixed(1)}KB): ${imgSrc}`);
                    console.warn(`❗ [${pageUrl}] Large image: ${imgSrc} (${sizeKB.toFixed(1)}KB)`);
                  }
                }
              });
            }
          });

          // --- Responsive image visibility checks ---
          // viewports.forEach((vp) => {
          //   const label = Array.isArray(vp) ? `${vp[0]}x${vp[1]}` : vp;
          //   if (Array.isArray(vp)) {
          //     cy.viewport(vp[0], vp[1]);
          //   } else {
          //     cy.viewport(vp);
          //   }

          //   cy.get('img').each(($img) => {
          //     if (!$img.is(':visible')) {
          //       const src = $img.prop('src');
          //       cy.log(`⚠️ Not visible on ${label}: ${src}`);
          //       console.warn(`⚠️ [${pageUrl}] Not visible on ${label}: ${src}`);
          //     }
          //   });
          // });
        });
      });
    });
  });
});
