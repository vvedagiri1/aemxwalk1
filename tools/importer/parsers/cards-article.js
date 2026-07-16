/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards (container block).
 * Source: https://www.wknd-trendsetters.site/
 * Model (card): image (reference) + text (richtext).
 * Each card = one row with 2 cells: [image, text].
 * Source cards are <a class="article-card"> with an image and a body
 * (tag + date meta and an <h3> title). The card's href is preserved by
 * turning the heading into a link.
 * imageAlt is a collapsed field (Alt) -> no hint; alt stays on <img>.
 */
export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a'));

  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardEls.forEach((card) => {
    const href = card.getAttribute('href');

    // --- Cell 1: image ---
    const img = card.querySelector('img');
    const imageCell = document.createDocumentFragment();
    if (img) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // --- Cell 2: text (richtext) = meta (tag + date) + linked heading ---
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    const meta = card.querySelector('.article-card-meta');
    if (meta) {
      const metaPara = document.createElement('p');
      const tag = meta.querySelector('.tag');
      const date = meta.querySelector('span:not(.tag)');
      const parts = [];
      if (tag) parts.push(tag.textContent.trim());
      if (date) parts.push(date.textContent.trim());
      metaPara.textContent = parts.join(' — ');
      if (metaPara.textContent) textCell.appendChild(metaPara);
    }

    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const titleText = heading.textContent.trim();
      const h = document.createElement('h3');
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = titleText;
        h.appendChild(link);
      } else {
        h.textContent = titleText;
      }
      textCell.appendChild(h);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
