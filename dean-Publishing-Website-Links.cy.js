describe('Verify Links in Book Listing - Conquer Your Imposter', () => {
    beforeEach(() => {
        cy.visit('https://www.deanpublishing.com/authors-books/conquer-your-imposter/'); // Update with actual page URL
        cy.get('.dsm_card_description', { timeout: 10000 }).should('be.visible');
        cy.get('img', { timeout: 15000 }).should('be.visible');
    });

    const links = [
        { name: 'Big W', url: 'https://www.bigw.com.au/product/conquer-your-imposter-by-alison-shamir/p/6018581' },
        { name: 'Fishpond', url: 'https://www.fishpond.com.au/Books/Conquer-Your-Imposter-Alison-Shamir/9781925452976' },
        { name: 'Booktopia', url: 'https://www.booktopia.com.au/conquer-your-imposter-alison-shamir/book/9781925452976.html' },
        { name: 'Amazon.com', url: 'https://www.amazon.com/Conquer-Your-Imposter-undermines-potential/dp/1925452972' },
        { name: 'Amazon.co.uk', url: 'https://www.amazon.co.uk/Conquer-Your-Imposter-undermines-potential/dp/1925452972' },
        { name: 'Amazon.in', url: 'https://www.amazon.in/Conquer-Your-Imposter-undermines-potential/dp/1925452972' },
        { name: 'Amazon.ca', url: 'https://www.amazon.ca/Conquer-Your-Imposter-undermines-potential/dp/1925452972' },
        { name: 'IndieBound', url: 'https://bookshop.org/p/books/conquer-your-imposter-dismantle-the-fear-that-undermines-your-success-unlock-your-true-potential-free-yourself-from-imposter-syndrome-for-good/0097a92f947ea30b?ean=9781925452976&next=t&next=t' },
        { name: 'Alibris', url: 'https://www.alibris.com/Conquer-Your-Imposter-Dismantle-the-fear-that-undermines-your-success-Unlock-your-true-potential-Free-yourself-from-Imposter-Syndrome-for-good-Alison-Shamir/book/55611237?matches=2' },
        { name: 'Barnes & Noble', url: 'https://www.barnesandnoble.com/w/conquer-your-imposter-alison-shamir/1147025956?ean=9781925452976' },
        { name: 'Boomerang Books', url: 'https://www.boomerangbooks.com.au/conquer-your-imposter-dismantle-the-fear-that-undermines-your-success-unlock-your-true-potential-free-yourself/alison-shamir/book_9781925452976.htm' },
        { name: 'Bokus', url: 'https://www.bokus.com/bok/9781925452976/conquer-your-imposter-dismantle-the-fear-that-undermines-your-success-unlock-your-true-potential-free-yourself-from-imposter-syndrome-for-good/' },
        { name: 'Books.com.tw', url: 'https://www.books.com.tw/products/F01b128211?sloc=main' },
        { name: 'Goodreads', url: 'https://www.goodreads.com/book/show/228200621-conquer-your-imposter?from_search=true&from_srp=true&qid=U0rbr2WHqL&rank=1' },
        { name: 'Trove', url: 'https://trove.nla.gov.au/work/258897230/version/292643075' }
    ];

    links.forEach(link => {
        it(`should have correct link for ${link.name}`, () => {
            cy.get(`a[href='${link.url}']`).should('exist').and('have.attr', 'href', link.url);
            cy.request({
                url: link.url,
                followRedirect: false
            }).then((response) => {
                expect(response.status).to.be.oneOf([200, 301, 302]);
            });
        });
    });
});
