//check inappropriate or adult links on a website

const xml2js = require('xml2js');

const parseXml = (xml) => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) reject(err);
      else resolve(result.urlset.url.map(u => u.loc[0]));
    });
  });
};

describe('Check all anchor links on sitemap pages for redirection to adult sites', () => {
  const adultPatterns = [
    /porn/i,
    /xxx/i,
    /sex/i,
    /adult/i,
    /cam/i,
    /erotic/i,
    /nsfw/i
  ];

  const sitemapUrl = ''; // add site map

  it('should not have anchor tags redirecting to adult websites', () => {
    cy.request(sitemapUrl).then((response) => {
      return parseXml(response.body).then((pageUrls) => {
        // Limit to first N pages for performance if needed
        pageUrls.slice(0, 10).forEach((pageUrl) => {
          cy.visit(pageUrl);

          cy.get('a[href]').each(($a) => {
            const href = $a.prop('href');

            // Skip mailto, tel, JavaScript links, and anchors
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
              return;
            }

            cy.request({
              url: href,
              followRedirect: true,
              failOnStatusCode: false,
            }).then((res) => {
              const finalRequest = res.allRequestResponses?.[res.allRequestResponses.length - 1]?.Request;
              const finalUrl = finalRequest?.url || href;

              adultPatterns.forEach((pattern) => {
                expect(finalUrl, `Link on ${pageUrl} pointing to ${finalUrl}`).not.to.match(pattern);
              });
            });
          });
        });
      });
    });
  });
});
