/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks + section metadata.
 *
 * Runs in afterTransform only. Reads payload.template.sections and, for each
 * section (processed in reverse document order so earlier inserts don't shift
 * later selectors):
 *   - inserts a Section Metadata block (via WebImporter.Blocks.createBlock)
 *     after the section element when the section has a `style`
 *   - inserts an <hr> before the section element for every non-first section
 *
 * Section selectors come from payload.template.sections[].selector, which were
 * derived from the captured DOM in migration-work/cleaned.html
 * (e.g. "#main-content > header.section.secondary-section").
 */
const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload
      && payload.template
      && Array.isArray(payload.template.sections)
      ? payload.template.sections
      : [];

    if (sections.length < 2) {
      return;
    }

    const doc = element.ownerDocument;

    // Process in reverse so inserting nodes doesn't disturb earlier selectors.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) {
        continue;
      }

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) {
        continue;
      }

      // Section Metadata block after the section, when a style is defined.
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (sectionEl.parentNode) {
          sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
        }
      }

      // Section break before every non-first section.
      if (i > 0 && sectionEl.parentNode) {
        const hr = doc.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
