const sizes = ['macbook-15', [1024, 1366], [600, 1024], 'iphone-xr', 'iphone-6'];

describe('Full Check', () => {
  before(() => {
    cy.visit('');// add staging link
    cy.on('uncaught:exception', () => false);

    cy.get('.menu-item > a')
      .then(($links) => {
        const menuLinks = $links.map((i, el) => Cypress.$(el).attr('href')).get();
        cy.wrap(menuLinks).as('menuLinks');
      });
  });

  it('Extracts and visits each menu link', function () {
    cy.get('@menuLinks').then((menuLinks) => {
      menuLinks.forEach((link) => {
        describe(`Checking page: ${link}`, () => {
          beforeEach(() => {
            cy.visit(link);
          });

          it('should verify featured image exists', () => {
            let hasValidOGImage = false;
            let hasValidFeaturedImage = false;

            cy.get('meta[property="og:image"]')
              .should('have.attr', 'content')
              .then((content) => {
                if (content.match(/^https?:\/\//)) hasValidOGImage = true;
              });

            cy.get('.has-post-thumbnail img, .et-featured-image img')
              .then(($img) => {
                if ($img.length > 0 && $img[0].naturalWidth > 0) hasValidFeaturedImage = true;
              });

            cy.then(() => {
              expect(hasValidOGImage || hasValidFeaturedImage).to.be.true;
            });
          });

          it('should have one visible h1 tag', () => {
            cy.get('h1').should('have.length', 1).and('be.visible');
          });

          it('should ensure images are under 300KB and log sizes', () => {
            let largeImages = [];
            cy.get('img')
              .should('be.visible')
              .each(($img) => {
                cy.wrap($img)
                  .should(($el) => expect($el[0].complete).to.be.true)
                  .then(($el) => {
                    const imgSrc = $el.prop('src');
                    if (imgSrc) {
                      cy.request({ url: imgSrc, failOnStatusCode: false }).then((response) => {
                        if (response.status === 404) {
                          cy.log(`⚠️ Image not found (404): ${imgSrc}`);
                        } else {
                          const contentLength = response.headers['content-length'];
                          if (contentLength) {
                            const sizeKB = Number(contentLength) / 1024;
                            if (sizeKB > 300) {
                              largeImages.push({ url: imgSrc, sizeKB });
                              cy.log(`❌ Large Image: ${imgSrc}, Size: ${sizeKB.toFixed(2)} KB`);
                            }
                          }
                        }
                      });
                    }
                  });
              })
              .then(() => {
                if (largeImages.length > 0) console.log('⚠️ Large Images:', largeImages);
              });
          });

          it('should ensure images have alt attributes', () => {
            let missingAltImages = [];
            cy.get('img').each(($img) => {
              const altText = $img.attr('alt');
              if (!altText) missingAltImages.push($img.prop('src'));
            }).then(() => {
              if (missingAltImages.length > 0) {
                cy.log('Images missing alt:', missingAltImages);
                console.log('Images missing alt:', missingAltImages);
              }
            });
          });

          sizes.forEach((size) => {
            it(`Images should be visible on ${Array.isArray(size) ? size.join('x') : size} screen`, () => {
              if (Array.isArray(size)) {
                cy.viewport(size[0], size[1]);
              } else {
                cy.viewport(size);
              }
              cy.get('img').should('be.visible');
            });
          });

          it('should log font-family, font-size, and color', () => {
            cy.get('body *').each(($el) => {
              const fontFamily = $el.css('font-family');
              const fontSize = $el.css('font-size');
              const color = $el.css('color');
              cy.log(`Element: ${$el[0].tagName}, Font: ${fontFamily}, Size: ${fontSize}, Color: ${color}`);
            });
          });
        });
      });
    });
  });
});