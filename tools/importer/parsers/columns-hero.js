/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Columns block: NO field hints; each direct child becomes a column cell.
 * Row 1 = block name (added by createBlock), Row 2 = the columns.
 */
export default function parse(element, { document }) {
  // The columns grid's direct children are the columns.
  const columnEls = Array.from(element.querySelectorAll(':scope > div'));

  // Guard: if there are no columns, unwrap and bail.
  if (columnEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Build a single content row where each column is its own cell.
  const row = columnEls.map((col) => col);

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero', cells });
  element.replaceWith(block);
}
