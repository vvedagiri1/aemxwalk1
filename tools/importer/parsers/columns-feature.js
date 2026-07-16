/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Columns block: NO field hints; each direct child becomes a column cell.
 * Row 1 = block name (added by createBlock), Row 2 = the columns
 * (left: feature image, right: breadcrumbs + heading + author meta).
 */
export default function parse(element, { document }) {
  const columnEls = Array.from(element.querySelectorAll(':scope > div'));

  if (columnEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const row = columnEls.map((col) => col);
  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
