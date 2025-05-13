describe('Full Check - Featured Image, H1, Links, and Images', () => {
  before(() => {
    cy.visit(''); // add staging link
    cy.on('uncaught:exception', () => false); // Prevent test failures on site errors

    cy.get('.menu-item > a').then(($links) => {
      const menuLinks = $links
        .map((i, el) => Cypress.$(el).attr('href'))
        .get()
        .filter((link) => link && !link.includes('app.gostudiopro.com') && !link.startsWith('tel')); // Exclude external links

      Cypress.env('menuLinks', menuLinks.length ? menuLinks : []); // Ensure menuLinks is not undefined
    });
  });

  it('Logs featured image and H1 count issues (but does not fail)', function () {
    let menuLinks = Cypress.env('menuLinks') || [];

    if (menuLinks.length === 0) {
      cy.log('⚠️ No menu links found.');
      console.warn('⚠️ No menu links found.');
      return;
    }

    let missingFeaturedImagePages = [];
    let incorrectH1CountPages = [];

    cy.wrap(menuLinks).each((link) => {
      cy.visit(link);

      // Check for featured image
      cy.document().then((doc) => {
        const hasOGImage = doc.querySelector('meta[property="og:image"]') !== null;
        const hasThumbnail = doc.querySelector('.has-post-thumbnail') !== null;

        if (!(hasOGImage || hasThumbnail)) {
          missingFeaturedImagePages.push(link);
        }
      });

      // Check for a single H1 tag (Without Failing)
      cy.document().then((doc) => {
        const h1Elements = doc.querySelectorAll('h1');
        const h1Count = h1Elements.length;

        if (h1Count !== 1) {
          incorrectH1CountPages.push({ url: link, count: h1Count });
        }else {
          cy.log(`✅ Found ${h1Count} h1`)
        }
      });
    });

    cy.then(() => {
      if (missingFeaturedImagePages.length) {
        cy.log(`🖼️ WARNING: Pages missing a featured image:`, missingFeaturedImagePages);
        console.warn(`🖼️ WARNING: Pages missing a featured image:`, missingFeaturedImagePages);
      }

      if (incorrectH1CountPages.length) {
        cy.log(`🔤 WARNING: Pages with incorrect H1 count:`, incorrectH1CountPages);
        console.warn(`🔤 WARNING: Pages with incorrect H1 count:`, incorrectH1CountPages);
      }
    });
  });

  it('Logs broken links (but does not fail)', function () {
    let menuLinks = Cypress.env('menuLinks') || [];

    if (menuLinks.length === 0) {
      cy.log('⚠️ No menu links found.');
      console.warn('⚠️ No menu links found.');
      return;
    }

    cy.wrap(menuLinks).each((link) => {
      cy.visit(link);

      cy.get('a[href^="http"]').each(($a) => {
        const href = $a.attr('href');

        cy.request({ url: href, failOnStatusCode: false }).then((response) => {
          if (response.status >= 400) {
            cy.log(`🔗 WARNING: Broken link found: ${href} (Status: ${response.status})`);
            console.warn(`🔗 WARNING: Broken link found: ${href} (Status: ${response.status})`);
          }
        });
      });
    });
  });

  it('Logs large images and missing alt text (but does not fail)', function () {
    let menuLinks = Cypress.env('menuLinks') || [];

    if (menuLinks.length === 0) {
      cy.log('⚠️ No menu links found.');
      console.warn('⚠️ No menu links found.');
      return;
    }

    cy.wrap(menuLinks).each((link) => {
      cy.visit(link);

      let largeImages = [];
      let missingAltTextImages = [];

      cy.get('img').each(($img) => {
        const src = $img.attr('src');
        const altText = $img.attr('alt') || '';

        if (!altText.trim()) {
          missingAltTextImages.push({ page: link, image: src });
        }

        cy.wrap($img).should('have.prop', 'naturalWidth').then((width) => {
          if (width > 50) { // Only check images larger than 50px width
            cy.wrap($img).invoke('prop', 'naturalHeight').then((height) => {
              cy.wrap($img).invoke('prop', 'complete').then((isLoaded) => {
                if (isLoaded && width * height > 300 * 1024) { // Approximate large image detection
                  largeImages.push({ page: link, image: src, size: `${width}x${height}px` });
                }
              });
            });
          }
        });
      });

      cy.then(() => {
        if (largeImages.length) {
          cy.log(`⚠️ WARNING: Large images found (>300KB):`, largeImages);
          console.warn(`⚠️ WARNING: Large images found (>300KB):`, largeImages);
        }

        if (missingAltTextImages.length) {
          cy.log(`🖼️ WARNING: Images missing alt text:`, missingAltTextImages);
          console.warn(`🖼️ WARNING: Images missing alt text:`, missingAltTextImages);
        }
      });
    });
  });
});
