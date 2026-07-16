/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero (simple block).
 * Source: https://www.wknd-trendsetters.site/
 * Structure: 1 column, up to 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background image  -> field:image (imageAlt is collapsed -> no hint)
 *   Row 3: text (heading + subheading + CTA) -> field:text
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('img');
  const heading = element.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p');
  const ctas = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!bgImage && !heading && !subheading && ctas.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (single cell)
  if (bgImage) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
    cells.push([imageCell]);
  }

  // Row 3: text content (single cell holding heading + subheading + CTAs)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (subheading) textCell.appendChild(subheading);
  ctas.forEach((cta) => textCell.appendChild(cta));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
