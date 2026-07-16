/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors below were verified against the captured
 * DOM in migration-work/cleaned.html:
 *   - <a class="skip-link">Skip to main content</a>  (accessibility skip link)
 *   - <div class="navbar"> ... </div>                (global header + mega menu)
 *   - <div class="breadcrumbs"> ... </div>           (breadcrumb nav inside featured article)
 *   - <footer class="footer inverse-footer"> ... </footer> (global footer)
 */
const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Nothing blocks block parsing on this static Astro page (no modals,
    // cookie banners, or overlays present in the captured DOM).
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (verified in cleaned.html).
    WebImporter.DOMUtils.remove(element, [
      '.skip-link', // accessibility skip link
      '.navbar', // global header / navigation with mega menu
      '.breadcrumbs', // breadcrumb navigation (non-authorable) in featured article section
      'footer.footer', // global site footer
    ]);
  }
}
