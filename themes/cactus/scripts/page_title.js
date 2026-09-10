/**
 * Page Title Helper
 * @description Generate page title.
 * @example
 *     <%- page_title() %>
 */

// The site title carries emoji for flavour; search results strip them anyway,
// so the brand suffix uses a clean text form.
function brandOf (config, theme) {
  if (theme && theme.seo && theme.seo.brand) return theme.seo.brand;
  return String(config.title || '')
    .replace(/[\u2190-\u21ff\u2300-\u23ff\u2600-\u27bf\ufe0f\u2b00-\u2bff]/g, '')
    .replace(/[\u{1f000}-\u{1ffff}]/gu, '')
    .replace(/[\u3000\s]+/g, ' ')
    .trim();
}

// Titles over roughly 60 characters get truncated in search results, so only
// append the brand when there is room for it.
var MAX_TITLE = 60;

hexo.extend.helper.register("page_title", function () {
  var title = this.page.title ? this.page.title : this.config.title;
  // Titles may contain markup for display; <title> needs plain text.
  title = String(title).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  var isHome = this.is_home();

  if (this.is_archive()) {
    title = this.__("nav.articles");

    if (this.is_month()) {
      title += ": " + this.page.year + "/" + this.page.month;
    } else if (this.is_year()) {
      title += ": " + this.page.year;
    }
  } else if (this.is_category()) {
    title = this.__("nav.category") + ": " + this.page.category;
  } else if (this.is_tag()) {
    title = this.__("nav.tag") + ": " + this.page.tag;
  }

  if (isHome) {
    return this.config.subtitle ? title + " | " + this.config.subtitle : title;
  }

  var brand = brandOf(this.config, this.theme);
  if (brand && title !== brand && (title.length + brand.length + 3) <= MAX_TITLE) {
    return title + " | " + brand;
  }
  return title;
});
