describe('Font Style Logger', () => {
  beforeEach(() => {
    cy.visit(''); // Change to your URL
  });

  it('should log unique font properties in batches', () => {
    const fontUsage = {};
    
    cy.get('*').each(($el) => {
      const tagName = $el.prop('tagName');
      const fontSize = $el.css('font-size');
      const lineHeight = $el.css('line-height');
      const fontFamily = $el.css('font-family');
      const fontWeight = $el.css('font-weight');
      
      const key = `${fontFamily} | ${fontSize} | ${lineHeight} | ${fontWeight}`;
      
      if (!fontUsage[key]) {
        fontUsage[key] = [];
      }
      fontUsage[key].push(tagName);
    }).then(() => {
      Object.entries(fontUsage).forEach(([fontProps, tags]) => {
        cy.log(`Font Properties: ${fontProps} -> Used in: ${tags.join(', ')}`);
      });
    });
  });
});