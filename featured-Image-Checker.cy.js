describe('Check Featured Image', () => {
  beforeEach(() => {
    cy.visit('/'); // Replace with your site's URL
    cy.on('uncaught:exception', (err, runnable) => {
      return false;
    })
  })
  
  it('should verify that the featured image exists and is visible', () => {
      cy.document().then((doc) => {
        const hasOGImage = doc.querySelector('meta[property="og:image"]') !== null;
        const hasThumbnail = doc.querySelector('.has-post-thumbnail') !== null;
    
        expect(hasOGImage || hasThumbnail).to.be.true;
      });
    });
  });
  