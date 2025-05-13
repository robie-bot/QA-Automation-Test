describe('Visit all menu links and log DSM classes', () => {
  const excludedLinks = [
    ''// add link to exclude a specific menu link
  ];

  const dsmClasses = [
    'dsm-active-filter',
    'dsm-advanced-tabs-container',
    'dsm-advanced-tabs-content-wrapper',
    'dsm-advanced-tabs-wrapper',
    'dsm-animated-gradient-text',
    'dsm-arrow-button-next0',
    'dsm-arrow-button-prev0',
    'dsm-badges',
    'dsm-badges-after',
    'dsm-before-after-image-slider-after',
    'dsm-before-after-image-slider-after-label',
    'dsm-before-after-image-slider-before',
    'dsm-before-after-image-slider-before-label',
    'dsm-before-after-image-slider-container',
    'dsm-before-after-image-slider-handle',
    'dsm-before-after-image-slider-horizontal',
    'dsm-before-after-image-slider-left-arrow',
    'dsm-before-after-image-slider-overlay',
    'dsm-before-after-image-slider-right-arrow',
    'dsm-before-after-image-slider-wrapper',
    'dsm-blog-carousel',
    'dsm-blog-carousel-wrapper',
    'dsm-center',
    'dsm-circle-info-button',
    'dsm-circle-info-container',
    'dsm-circle-info-content',
    'dsm-content',
    'dsm-content-timeline-items-wrapper',
    'dsm-content-timeline-tree',
    'dsm-content-toggle',
    'dsm-content-toggle-body',
    'dsm-content-toggle-header',
    'dsm-current-progress',
    'dsm-default',
    'dsm-divider',
    'dsm-dual-heading-before',
    'dsm-dual-heading-main',
    'dsm-dual-heading-middle',
    'dsm-entry-content',
    'dsm-entry-header',
    'dsm-entry-image',
    'dsm-entry-meta',
    'dsm-entry-thumbnail',
    'dsm-entry-title',
    'dsm-entry-wrapper',
    'dsm-facebook-comments',
    'dsm-facebook-embed',
    'dsm-facebook-feed',
    'dsm-facebook-like',
    'dsm-faq-container',
    'dsm-filterable-category-container',
    'dsm-filterable-gallery-container',
    'dsm-filterable-gallery-filter-item',
    'dsm-filterable-gallery-image-wrapper',
    'dsm-filterable-gallery-inner-container',
    'dsm-filterable-gallery-inner-item',
    'dsm-filterable-gallery-item',
    'dsm-flipbox',
    'dsm-flipbox-effect-right',
    'dsm-front',
    'dsm-gallery',
    'dsm-glitch-effect-type-one',
    'dsm-glitch-text',
    'dsm-glitch-text-effect',
    'dsm-gradient',
    'dsm-gradient-text',
    'dsm-grid-post-holder-inner',
    'dsm-grow',
    'dsm-icon-divider-after',
    'dsm-icon-divider-align-center',
    'dsm-icon-divider-before',
    'dsm-icon-divider-wrapper',
    'dsm-icon_text',
    'dsm-image-reveal',
    'dsm-image-reveal-back',
    'dsm-image-reveal-overlay',
    'dsm-image-reveal-text',
    'dsm-image-reveal-text-wrapper',
    'dsm-image-wrap',
    'dsm-image-wrapper',
    'dsm-input',
    'dsm-mask-text',
    'dsm-menu',
    'dsm-menu-container',
    'dsm-menu-layout-vertical',
    'dsm-menu-style-type-disc',
    'dsm-menu-style-type-none',
    'dsm-menu-title',
    'dsm-meta-seperator',
    'dsm-pagination0',
    'dsm-perspective-image-wrapper',
    'dsm-post-arrow-button-next0',
    'dsm-post-arrow-button-prev0',
    'dsm-post-carousel',
    'dsm-post-carousel-item',
    'dsm-post-carousel-wrapper',
    'dsm-post-excerpt',
    'dsm-post-pagination0',
    'dsm-posted-by',
    'dsm-posted-on',
    'dsm-progress-bar-container',
    'dsm-progress-bar-tracker-horizontal',
    'dsm-rotate-text',
    'dsm-rotate-text-main',
    'dsm-rotate-word',
    'dsm-scroll-direction-vertical',
    'dsm-scroll-image-wrapper',
    'dsm-shuffle-letters',
    'dsm-shuffle-text',
    'dsm-skip-lazyload',
    'dsm-social-share-buttons-container',
    'dsm-star-display-type-inline-block',
    'dsm-star-full',
    'dsm-star-rating',
    'dsm-star-rating-wrapper',
    'dsm-star-title-position-left',
    'dsm-step-flow-container',
    'dsm-steps-image-icon-wrapper',
    'dsm-svg-animation-container',
    'dsm-switch-inner',
    'dsm-switch-label',
    'dsm-text-badges',
    'dsm-text-badges-main',
    'dsm-text-divider-after',
    'dsm-text-divider-align-center',
    'dsm-text-divider-before',
    'dsm-text-divider-header',
    'dsm-text-divider-wrapper',
    'dsm-text-notation-main',
    'dsm-text-notation-middle',
    'dsm-text-path-container',
    'dsm-tilt-image-wrapper',
    'dsm-title',
    'dsm-toggle',
    'dsm-toggle-btn',
    'dsm-toggle-head-one',
    'dsm-toggle-head-two',
    'dsm-toggle-left',
    'dsm-toggle-right',
    'dsm-toggle-switch',
    'dsm-twitter-timeline',
    'dsm-typing',
    'dsm-typing-effect',
    'dsm-typing-strings',
    'dsm-typing-wrapper'
  ];

  before(() => {
    cy.visit('');// add homepage url
    cy.on('uncaught:exception', () => false);

    cy.get('.menu-item > a')
      .then(($links) => {
        let menuLinks = $links.map((i, el) => Cypress.$(el).attr('href')).get();

        // Filter out excluded links
        menuLinks = menuLinks.filter(link => !excludedLinks.includes(link));

        cy.wrap(menuLinks).as('menuLinks');
      });
  });

  it('Visits each menu link and logs existing DSM classes', function () {
    cy.get('@menuLinks').then((menuLinks) => {
      menuLinks.forEach((link) => {
        cy.visit(link);

        // Wait for page to load
        cy.wait(2000);

        cy.document().then((doc) => {
          const foundClasses = dsmClasses.filter((cls) => doc.querySelector(`.${cls}`));
          
          if (foundClasses.length > 0) {
            cy.log(`Page: ${link} - Found DSM classes: ${foundClasses.join(', ')}`);
          } else {
            cy.log(`Page: ${link} - No DSM classes found.`);
          }
        });
      });
    });
  });
});
