describe('Compare Multiple Pages Between Production and Staging', () => {
  //cross check existing and staging site content
  const pages = [
    {
      prod: 'https://www.',
      staging: 'https://refresh-staging.nyg1r0.ap-southeast-2.wpstaqhosting.com',
    }
  ];

  pages.forEach(({ prod, staging }) => {
    it(`Compare content between: ${prod} and ${staging}`, () => {
      let content1 = ''; // Store text from production
      let content2 = ''; // Store text from staging

      // Visit Production Page & Extract Content
      cy.visit(prod);
      cy.on("uncaught:exception", () => false); // Ignore JS errors

      cy.get('.w-post-elm.post_content.without_sections .wpb_wrapper')
        .invoke('text')
        .then((text) => {
          content1 = text.replace(/\s+/g, ' ').trim(); // Normalize whitespace
        });

      // Visit Staging Page inside cy.origin() & Extract Content
      cy.origin(staging, () => {
        cy.visit('/');
        cy.on("uncaught:exception", () => false); // Ignore JS errors

        cy.get('.et_pb_module.et_pb_text.et_pb_text_0 .et_pb_text_inner')
          .invoke('text')
          .then((text) => {
            return text.replace(/\s+/g, ' ').trim(); // Normalize whitespace
          });
      }).then((text2) => {
        content2 = text2;
        expect(content1).to.equal(content2, `Content mismatch for: ${prod}`);
      });
    });
  });
});
