/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs (container block).
 * Source: https://www.wknd-trendsetters.site/
 *
 * Model (tabs-testimonial-item):
 *   - title            (text)     -> tab label, cell 1
 *   - content_heading  (text)     -> rendered as heading (content_headingType h3, collapsed)
 *   - content_image    (reference)
 *   - content_richtext (richtext)
 * content_* fields share the "content" prefix -> grouped into cell 2.
 * content_headingType ends in "Type" -> collapsed, no hint.
 *
 * Each tab = one row with 2 cells: [title, content group].
 * Tab labels come from the tab-menu buttons; content comes from the matching tab-pane.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu button'));

  if (panes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  panes.forEach((pane, i) => {
    // --- Cell 1: tab title/label ---
    // Derive label text from the matching menu button (name in <strong>), fallback to pane name.
    const button = menuButtons[i];
    let labelText = '';
    if (button) {
      const nameEl = button.querySelector('strong');
      labelText = (nameEl ? nameEl.textContent : button.textContent).trim();
    }
    if (!labelText) {
      const paneName = pane.querySelector('strong');
      labelText = paneName ? paneName.textContent.trim() : `Tab ${i + 1}`;
    }
    const titleCell = document.createDocumentFragment();
    titleCell.appendChild(document.createComment(' field:title '));
    titleCell.appendChild(document.createTextNode(labelText));

    // --- Cell 2: grouped content (heading + image + richtext) ---
    const contentCell = document.createDocumentFragment();

    // content_heading: the person's name, rendered as a heading (h3 per model default).
    const nameStrong = pane.querySelector('.paragraph-xl strong, strong');
    const role = pane.querySelector('.paragraph-xl.utility-margin-bottom-0 + div, div:not([class]) > div:nth-child(2)');
    const headingText = nameStrong ? nameStrong.textContent.trim() : '';
    if (headingText) {
      const heading = document.createElement('h3');
      heading.textContent = headingText;
      contentCell.appendChild(document.createComment(' field:content_heading '));
      contentCell.appendChild(heading);
    }

    // content_image
    const img = pane.querySelector('img');
    if (img) {
      contentCell.appendChild(document.createComment(' field:content_image '));
      contentCell.appendChild(img);
    }

    // content_richtext: role line + the quote paragraph.
    contentCell.appendChild(document.createComment(' field:content_richtext '));
    // Role/subtitle (e.g. "Streetwear Enthusiast")
    const infoBlock = pane.querySelector('div[style*="margin-bottom"]');
    if (infoBlock) {
      const roleDiv = Array.from(infoBlock.querySelectorAll('div')).find(
        (d) => d.textContent.trim() && !d.querySelector('strong'),
      );
      if (roleDiv) {
        const rolePara = document.createElement('p');
        rolePara.textContent = roleDiv.textContent.trim();
        contentCell.appendChild(rolePara);
      }
    }
    // Quote paragraph
    const quote = pane.querySelector('p.paragraph-xl, p');
    if (quote) {
      contentCell.appendChild(quote);
    }

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
