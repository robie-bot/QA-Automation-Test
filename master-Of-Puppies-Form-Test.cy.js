import Papa from 'papaparse';

describe('Gravity Form: Suburb Redirect Validation', () => {
  let suburbData = [];

  before(() => {
    cy.fixture('suburb_redirects_emma.csv').then(csvData => {
      return new Cypress.Promise((resolve) => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            suburbData = results.data
              .filter(row => row.Suburb && row.Trainer && row['Initial Consult Link'])
              .map(row => ({
                Suburb: row.Suburb.trim(),
                Trainer: row.Trainer.split(',')[0].trim(),
                Link: row['Follow-Up Link'].trim(),
                input_17: row['input_17_value']?.trim(),
                input_18: row['input_18_value']?.trim(),
                input_19: row['input_19_value']?.trim(),
                input_21: row['input_21_value']?.trim(),
              }));
            resolve();
          }
        });
      });
    });
  });

  it('submits suburb/trainer and validates redirect URL matches Follow-Up Link', () => {
    const failedSuburbs = [];

    cy.wrap(suburbData.filter(row => row.Trainer.toLowerCase().includes('emma'))).each((row) => {
      const { Suburb, Trainer, Link } = row;

      cy.visit('https://www.masterofpuppies.com.au/online-booking-assistant/', {
        onBeforeLoad(win) {
          cy.stub(win, 'open').callsFake((url) => {
            console.log('Intercepted redirect:', url);
          }).as('windowOpen');

          Object.defineProperty(win.HTMLFormElement.prototype, 'target', {
            set() {},
            get() {
              return '_self';
            }
          });
        }
      });

      // Required fields
      cy.get('input[name="input_8"][value="No"]').check({ force: true });
      cy.get('input[name="input_9"][value="Over 6 months"]').check({ force: true });
      cy.get('input[name="input_11"][value="No"]').check({ force: true });
      // cy.get('select[name="input_68"]').select("In-Home Training");

      cy.get('select[name="input_68"]').select("In-Home Training");

      cy.get('select[name="input_16"]').select(Suburb);
      cy.get('select[name="input_19"]').should('contain', Trainer).select(Trainer, { force: true });

      // Optional fields
      const optionalFields = [
        { name: 'input_17', type: 'radio', value: row.input_17 },
        { name: 'input_18', type: 'radio', value: row.input_18 },
        { name: 'input_19', type: 'text', value: row.input_19 },
        { name: 'input_21', type: 'radio', value: row.input_21 }
      ];

      optionalFields.forEach(({ name, type, value }) => {
        if (!value) return;

        cy.get('body').then($body => {
          if ($body.find(`[name="${name}"]`).length > 0) {
            cy.log(`Filling optional field: ${name} = ${value}`);
            switch (type) {
              case 'radio':
              case 'checkbox':
                cy.get(`[name="${name}"][value="${value}"]`).check({ force: true });
                break;
              case 'text':
                cy.get(`[name="${name}"]`).clear().type(value);
                break;
              case 'select':
                cy.get(`select[name="${name}"]`).select(value, { force: true });
                break;
            }
          } else {
            cy.log(`Field ${name} not present — skipping.`);
          }
        });
      });

      // Submit form
      cy.get('#gform_submit_button_62').click();

      // Wait for the redirect to be intercepted
      cy.get('@windowOpen').then((stub) => {
        const redirectedUrl = stub.getCall(0)?.args[0];
        const normalizedRedirect = redirectedUrl?.split('?')[0];
        const normalizedExpected = Link.split('?')[0];

        if (!redirectedUrl || normalizedRedirect !== normalizedExpected) {
          
          failedSuburbs.push({
            Suburb,
            Trainer,
            expected: normalizedExpected,
            got: redirectedUrl || 'No redirect triggered'
          });
          cy.log(`❌ ${Suburb} wrong link. Got: ${redirectedUrl || 'No redirect'} | Expected: ${normalizedExpected}`);

          // cy.screenshot(`fail-${Suburb}-${Trainer}`);
        } else {
          cy.log(`✅ ${Suburb} redirected correctly.`);
        }
      });

    }).then(() => {
      if (failedSuburbs.length > 0) {
        const filename = `cypress/results/failed_suburb_redirects-${Date.now()}.json`;
        cy.log(failedSuburbs)
        cy.writeFile(filename, failedSuburbs);
        throw new Error(`${failedSuburbs.length} suburb redirect mismatch(es) found. See: ${filename}`);
      } else {
        cy.log('✅ All suburb redirects matched!');
      }
    });
  });
});

Cypress.on('uncaught:exception', () => false);
