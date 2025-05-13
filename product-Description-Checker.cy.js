// to cross check description if it is applied on the front-end

const { XMLParser } = require("fast-xml-parser");


describe("Check Product Short Descriptions", () => {
  let productData = [];
  // List multiple sitemap URLs directly
  const sitemapUrls = [
    // "https://www.gasdetectionaustralia.com.au/product-sitemap1.xml",
    "https://www.gasdetectionaustralia.com.au/product-sitemap2.xml",
    // "https://www.gasdetectionaustralia.com.au/product-sitemap3.xml"
    // Add more sitemap URLs as needed
  ];

  before(() => {
    // Read product data from the Excel file
    cy.task("parseExcel", { filePath: "cypress/fixtures/Gas Detection - Product and Short Description.xlsx" }).then((data) => {
      productData = data;
    });
  });

  // Loop over each sitemap URL
  sitemapUrls.forEach((sitemapUrl) => {
    it(`Validates short descriptions on product pages from ${sitemapUrl}`, () => {
      cy.request(sitemapUrl).then((response) => {
        const parser = new XMLParser();
        const sitemap = parser.parse(response.body);
        const urls = sitemap.urlset.url.map((entry) => entry.loc);

        // Loop through each product URL in the sitemap
        urls.forEach((url) => {
          cy.visit(url ,{ failOnStatusCode: false, timeout: 120000 });
          cy.on('uncaught:exception', () => false); // Prevent test failures on site errors

          // Get the product name from the page
          cy.get("h1").then(($h1) => {
            const productName = $h1.text().trim();
            const productEntry = productData.find((p) => p["Name"] === productName);

            if (productEntry) {
              cy.get("body").then(($body) => {
                if ($body.find(".et_pb_module_inner > p").length === 0) {
                  cy.log(`❌ Short description not found for: ${productName} (${url})`);
                  return; // Skip further checks for this product
                }
              
                cy.get(".et_pb_module_inner > p").invoke("text").then((shortDesc) => {
                  shortDesc = shortDesc.trim();
                  const expectedDesc = productEntry["Short description"].trim();
              
                  if (!shortDesc) {
                    cy.log(`❌ Missing short description for: ${productName} (${url})`);
                  } else if (shortDesc === expectedDesc) {
                    cy.log(`✅ Match for ${productName}: "${expectedDesc}"`);
                  } else {
                    cy.log(`⚠️ Mismatch for ${productName}: Expected "${expectedDesc}", Found "${shortDesc}"`);
                  }
                });
              });
              
            } else {
              cy.log(`❓ Product not found in Excel: ${productName} (${url})`);
            }
          });
        });
      });
    });
  });
});
