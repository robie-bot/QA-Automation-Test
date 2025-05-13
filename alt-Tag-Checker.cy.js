describe('template spec', () => {
  beforeEach(() => {
    cy.visit(''); // Replace with your site's URL
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    })
  })

  it('images should have alt', () => {
    let missingAltImages = [];

    cy.get('img').each(($img) => {
      const altText = $img.attr('alt');
      if (!altText) {
        missingAltImages.push($img.prop('src'));
      }
    }).then(() => {
      if (missingAltImages.length > 0) {
        cy.log('Images missing alt:', missingAltImages);
        console.log('Images missing alt:', missingAltImages); 
      }
    });
  })

})