/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion (container block).
 * Source: https://www.wknd-trendsetters.site/
 * Model (accordion-faq-item): summary (text, the question) + text (richtext, the answer).
 * Each <details.faq-item> = one row with 2 cells: [summary, text].
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > details, .faq-item'));

  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    // --- Cell 1: summary (question) ---
    const summaryEl = item.querySelector('summary, .faq-question');
    const summaryText = summaryEl ? summaryEl.textContent.trim() : '';
    const summaryCell = document.createDocumentFragment();
    summaryCell.appendChild(document.createComment(' field:summary '));
    summaryCell.appendChild(document.createTextNode(summaryText));

    // --- Cell 2: text (answer, richtext) ---
    const answerEl = item.querySelector('.faq-answer');
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (answerEl) {
      Array.from(answerEl.childNodes).forEach((node) => textCell.appendChild(node));
    }

    cells.push([summaryCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
