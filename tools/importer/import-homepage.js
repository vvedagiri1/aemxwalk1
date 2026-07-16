/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import accordionFaqParser from './parsers/accordion-faq.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsHeroParser from './parsers/columns-hero.js';
import heroBannerParser from './parsers/hero-banner.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters homepage: hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner',
  urls: [
    'https://www.wknd-trendsetters.site/',
  ],
  blocks: [
    {
      name: 'columns-hero',
      instances: ['#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl'],
    },
    {
      name: 'columns-feature',
      instances: ['#main-content > section.section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg'],
    },
    {
      name: 'cards-gallery',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['#main-content > section.section:nth-of-type(3) .tabs-wrapper'],
    },
    {
      name: 'cards-article',
      instances: ['#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column.grid-gap-md'],
    },
    {
      name: 'accordion-faq',
      instances: ['#main-content > section.section:nth-of-type(5) .faq-list'],
    },
    {
      name: 'hero-banner',
      instances: ['#main-content > section.section.inverse-section .grid-layout.desktop-1-column'],
    },
  ],
  sections: [
    { id: 'rc2', name: 'Hero header', selector: '#main-content > header.section.secondary-section', style: 'grey', blocks: ['columns-hero'], defaultContent: [] },
    { id: 'rc3', name: 'Featured article', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc4', name: 'Image gallery', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'grey', blocks: ['cards-gallery'], defaultContent: [] },
    { id: 'rc5', name: 'Testimonials', selector: '#main-content > section.section:nth-of-type(3)', style: null, blocks: ['tabs-testimonial'], defaultContent: [] },
    { id: 'rc6', name: 'Latest articles', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'grey', blocks: ['cards-article'], defaultContent: [] },
    { id: 'rc7', name: 'FAQ', selector: '#main-content > section.section:nth-of-type(5)', style: null, blocks: ['accordion-faq'], defaultContent: [] },
    { id: 'rc8', name: 'CTA banner', selector: '#main-content > section.section.inverse-section', style: null, blocks: ['hero-banner'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'columns-hero': columnsHeroParser,
  'columns-feature': columnsFeatureParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
