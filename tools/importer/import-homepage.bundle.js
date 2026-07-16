/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/accordion-faq.js
  function parse(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > details, .faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summaryEl = item.querySelector("summary, .faq-question");
      const summaryText = summaryEl ? summaryEl.textContent.trim() : "";
      const summaryCell = document.createDocumentFragment();
      summaryCell.appendChild(document.createComment(" field:summary "));
      summaryCell.appendChild(document.createTextNode(summaryText));
      const answerEl = item.querySelector(".faq-answer");
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (answerEl) {
        Array.from(answerEl.childNodes).forEach((node) => textCell.appendChild(node));
      }
      cells.push([summaryCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a"));
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((card) => {
      const href = card.getAttribute("href");
      const img = card.querySelector("img");
      const imageCell = document.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const meta = card.querySelector(".article-card-meta");
      if (meta) {
        const metaPara = document.createElement("p");
        const tag = meta.querySelector(".tag");
        const date = meta.querySelector("span:not(.tag)");
        const parts = [];
        if (tag) parts.push(tag.textContent.trim());
        if (date) parts.push(date.textContent.trim());
        metaPara.textContent = parts.join(" \u2014 ");
        if (metaPara.textContent) textCell.appendChild(metaPara);
      }
      const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) {
        const titleText = heading.textContent.trim();
        const h = document.createElement("h3");
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = titleText;
          h.appendChild(link);
        } else {
          h.textContent = titleText;
        }
        textCell.appendChild(h);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > div"));
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector("img");
      const imageCell = document.createDocumentFragment();
      if (img) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(img);
      }
      const textCell = "";
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse4(element, { document }) {
    const columnEls = Array.from(element.querySelectorAll(":scope > div"));
    if (columnEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columnEls.map((col) => col);
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-hero.js
  function parse5(element, { document }) {
    const columnEls = Array.from(element.querySelectorAll(":scope > div"));
    if (columnEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = columnEls.map((col) => col);
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse6(element, { document }) {
    const bgImage = element.querySelector("img");
    const heading = element.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector("p.subheading, p");
    const ctas = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!bgImage && !heading && !subheading && ctas.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) {
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      imageCell.appendChild(bgImage);
      cells.push([imageCell]);
    }
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (subheading) textCell.appendChild(subheading);
    ctas.forEach((cta) => textCell.appendChild(cta));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse7(element, { document }) {
    const panes = Array.from(element.querySelectorAll(".tab-pane"));
    const menuButtons = Array.from(element.querySelectorAll(".tab-menu .tab-menu-link, .tab-menu button"));
    if (panes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panes.forEach((pane, i) => {
      const button = menuButtons[i];
      let labelText = "";
      if (button) {
        const nameEl = button.querySelector("strong");
        labelText = (nameEl ? nameEl.textContent : button.textContent).trim();
      }
      if (!labelText) {
        const paneName = pane.querySelector("strong");
        labelText = paneName ? paneName.textContent.trim() : `Tab ${i + 1}`;
      }
      const titleCell = document.createDocumentFragment();
      titleCell.appendChild(document.createComment(" field:title "));
      titleCell.appendChild(document.createTextNode(labelText));
      const contentCell = document.createDocumentFragment();
      const nameStrong = pane.querySelector(".paragraph-xl strong, strong");
      const role = pane.querySelector(".paragraph-xl.utility-margin-bottom-0 + div, div:not([class]) > div:nth-child(2)");
      const headingText = nameStrong ? nameStrong.textContent.trim() : "";
      if (headingText) {
        const heading = document.createElement("h3");
        heading.textContent = headingText;
        contentCell.appendChild(document.createComment(" field:content_heading "));
        contentCell.appendChild(heading);
      }
      const img = pane.querySelector("img");
      if (img) {
        contentCell.appendChild(document.createComment(" field:content_image "));
        contentCell.appendChild(img);
      }
      contentCell.appendChild(document.createComment(" field:content_richtext "));
      const infoBlock = pane.querySelector('div[style*="margin-bottom"]');
      if (infoBlock) {
        const roleDiv = Array.from(infoBlock.querySelectorAll("div")).find(
          (d) => d.textContent.trim() && !d.querySelector("strong")
        );
        if (roleDiv) {
          const rolePara = document.createElement("p");
          rolePara.textContent = roleDiv.textContent.trim();
          contentCell.appendChild(rolePara);
        }
      }
      const quote = pane.querySelector("p.paragraph-xl, p");
      if (quote) {
        contentCell.appendChild(quote);
      }
      cells.push([titleCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        // accessibility skip link
        ".navbar",
        // global header / navigation with mega menu
        ".breadcrumbs",
        // breadcrumb navigation (non-authorable) in featured article section
        "footer.footer"
        // global site footer
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && Array.isArray(payload.template.sections) ? payload.template.sections : [];
      if (sections.length < 2) {
        return;
      }
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) {
          continue;
        }
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) {
          continue;
        }
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.parentNode) {
            sectionEl.parentNode.insertBefore(metadataBlock, sectionEl.nextSibling);
          }
        }
        if (i > 0 && sectionEl.parentNode) {
          const hr = doc.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters homepage: hero, featured article, image gallery, testimonials tabs, latest articles cards, FAQ accordion, and CTA banner",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-hero",
        instances: ["#main-content > header.section.secondary-section .grid-layout.tablet-1-column.grid-gap-xxl"]
      },
      {
        name: "columns-feature",
        instances: ["#main-content > section.section:nth-of-type(1) .grid-layout.tablet-1-column.grid-gap-lg"]
      },
      {
        name: "cards-gallery",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["#main-content > section.section:nth-of-type(3) .tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(4) .grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["#main-content > section.section:nth-of-type(5) .faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["#main-content > section.section.inverse-section .grid-layout.desktop-1-column"]
      }
    ],
    sections: [
      { id: "rc2", name: "Hero header", selector: "#main-content > header.section.secondary-section", style: "grey", blocks: ["columns-hero"], defaultContent: [] },
      { id: "rc3", name: "Featured article", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc4", name: "Image gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "grey", blocks: ["cards-gallery"], defaultContent: [] },
      { id: "rc5", name: "Testimonials", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-testimonial"], defaultContent: [] },
      { id: "rc6", name: "Latest articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "grey", blocks: ["cards-article"], defaultContent: [] },
      { id: "rc7", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: [] },
      { id: "rc8", name: "CTA banner", selector: "#main-content > section.section.inverse-section", style: null, blocks: ["hero-banner"], defaultContent: [] }
    ]
  };
  var parsers = {
    "columns-hero": parse5,
    "columns-feature": parse4,
    "cards-gallery": parse3,
    "tabs-testimonial": parse7,
    "cards-article": parse2,
    "accordion-faq": parse,
    "hero-banner": parse6
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
