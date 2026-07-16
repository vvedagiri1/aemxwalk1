/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards (container block).
 * Source: https://www.wknd-trendsetters.site/
 * Model (card): image (reference) + text (richtext).
 * Each card = one row with 2 cells: [image, text].
 * This gallery has image-only cards, so the text cell is left empty (no hint).
 * imageAlt is a collapsed field (Alt suffix) -> no field hint; alt stays on <img>.
 */
export default function parse(element, { document }) {
  // Each direct child div is a single card/tile.
  const cardEls = Array.from(element.querySelectorAll(':scope > div'));

  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardEls.forEach((card) => {
    const img = card.querySelector('img');

    // Cell 1: image with field hint
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Cell 2: text (richtext). Empty for image-only gallery -> no hint, empty cell.
    const textCell = '';

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
