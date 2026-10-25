/**
* SEO Helpers
* @description Per-page meta description, keywords, language, share image and
*              JSON-LD structured data. Keeps head.ejs free of logic.
*/

// Imgur page URLs (imgur.com/<id>.jpg) 302-redirect to the CDN. Social and
// search crawlers are happier with the direct asset, so normalise them.
function normalizeImgur (url) {
    return url.replace(/^(https?:)?\/\/(?:www\.)?imgur\.com\//, 'https://i.imgur.com/');
}

function stripHtml (str) {
    return String(str)
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x([0-9a-f]+);/gi, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
        .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(parseInt(d, 10)); })
        .replace(/\s+/g, ' ')
        .trim();
}

function isCJK (str) {
    var cjk = (str.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || []).length;
    return cjk > str.length * 0.2;
}

// Google truncates descriptions by pixel width, so CJK text needs a shorter cap
// than Latin text to survive the same snippet budget.
function truncate (str, limit) {
    if (str.length <= limit) return str;
    return str.slice(0, limit - 1).replace(/[\s、，,.。]+$/, '') + '…';
}

function describe (page, config) {
    if (page.description) return String(page.description).trim();

    // Prefer the first real paragraph: stripping the whole document instead
    // leads with heading fragments like "序", which make a poor snippet.
    var body = '';
    var html = page.content || page.excerpt || '';
    var paras = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
    var texts = [];
    for (var i = 0; i < paras.length; i++) {
        // A paragraph that is just a cross-link ("長崎編はこちら →") describes the
        // other post, not this one, so it makes a misleading snippet.
        var linkOnly = /^<p[^>]*>\s*<a[\s\S]*<\/a>\s*<\/p>$/i.test(paras[i]);
        var text = stripHtml(paras[i]);
        if (!text || linkOnly) continue;
        texts.push(text);
        if (text.length >= 40) { body = text; break; }
    }
    if (!body && texts.length) body = texts.join(' ');
    if (!body) body = stripHtml(html);
    // Drop a leading duplicate of the title; it adds nothing to the snippet.
    if (page.title) {
        var title = stripHtml(page.title);
        if (body.indexOf(title) === 0) body = body.slice(title.length).trim();
    }
    if (body) return truncate(body, isCJK(body) ? 110 : 160);

    return siteSummary(config);
}

// `description` is the poetic tagline shown on the home page. It says nothing
// about what the site covers, so search and AI systems get `site_summary`.
function siteSummary (config) {
    return String(config.site_summary || config.description || '').trim();
}

function keywordsOf (page, config) {
    if (page.keywords) {
        return Array.isArray(page.keywords) ? page.keywords.join(', ') : String(page.keywords).trim();
    }
    var tags = [];
    if (page.tags && page.tags.length) {
        // Hexo tag collections expose .toArray(); plain front matter gives an array.
        var list = typeof page.tags.toArray === 'function' ? page.tags.toArray() : page.tags;
        tags = list.map(function (t) { return t.name || t; });
    }
    if (tags.length) return tags.join(', ');
    return config.keywords ? String(config.keywords).trim() : '';
}

function firstImage (page) {
    var content = page.content || '';
    var m = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : '';
}

// Some titles carry markup (e.g. a <br> for a two-line heading). That belongs
// in the H1, not in <title> or og:title.
hexo.extend.helper.register('seo_title', function (page) {
    return stripHtml(page.title || '');
});

// The site title carries emoji; search and AI systems disambiguate better with a
// plain-text alternate name alongside it.
function plainName (title) {
    return String(title || '')
        .replace(/[\u2190-\u21ff\u2300-\u23ff\u2600-\u27bf\ufe0f\u2b00-\u2bff]/g, '')
        .replace(/[\u{1f000}-\u{1ffff}]/gu, '')
        .replace(/[\u3000\s]+/g, ' ')
        .trim();
}

hexo.extend.helper.register('seo_lang', function (page) {
    return page.lang || this.config.language || 'en';
});

// og:locale wants ja_JP / zh_CN style, the html lang attribute wants ja / zh-CN.
hexo.extend.helper.register('seo_locale', function (page) {
    var lang = (page.lang || this.config.language || 'en').replace('-', '_');
    if (lang.indexOf('_') === -1) {
        var region = { ja: 'JP', en: 'US', zh: 'CN', ko: 'KR' }[lang];
        if (region) lang = lang + '_' + region;
    }
    return lang;
});

// Listing pages carry no prose of their own, so without this every tag,
// category and archive page would inherit the same site-wide description.
function postTitles (posts, n) {
    if (!posts) return [];
    var arr = typeof posts.toArray === 'function' ? posts.toArray() : (posts.data || posts);
    return arr.slice(0, n)
        .map(function (p) { return stripHtml(p.title || ''); })
        .filter(Boolean);
}

function listingDescription (label, kind, posts) {
    var count = posts && typeof posts.length === 'number' ? posts.length : 0;
    var titles = postTitles(posts, 3);
    var head = label + kind + 'の記事一覧（' + count + '件）';
    if (!titles.length) return head + '。';
    return truncate(head + '：' + titles.join('、') + (count > titles.length ? ' ほか。' : '。'), 118);
}

hexo.extend.helper.register('seo_description', function (page) {
    if (page.description) return String(page.description).trim();

    if (this.is_tag()) {
        return listingDescription('「' + page.tag + '」', 'タグ', page.posts);
    }
    if (this.is_category()) {
        return listingDescription('「' + page.category + '」', 'カテゴリ', page.posts);
    }
    if (this.is_archive()) {
        if (this.is_month()) return listingDescription(page.year + '年' + page.month + '月', '', page.posts);
        if (this.is_year()) return listingDescription(page.year + '年', '', page.posts);
        return listingDescription('全', '', page.posts);
    }

    return describe(page, this.config);
});

hexo.extend.helper.register('seo_keywords', function (page) {
    return keywordsOf(page, this.config);
});

hexo.extend.helper.register('seo_image', function (page) {
    var img = page.thumbnail || page.banner || page.image || firstImage(page) || this.theme.og_image || '';
    if (!img) return '';
    img = normalizeImgur(img);
    return /^https?:\/\//.test(img) ? img : this.full_url_for(img);
});

// Posts are written in several languages. List them all (site default first,
// then by post count) so the site entity does not claim to be Japanese-only.
function siteLanguages (site, config) {
    var counts = {};
    var posts = site && site.posts ? site.posts.toArray() : [];
    posts.forEach(function (p) {
        var lang = p.lang || config.language;
        counts[lang] = (counts[lang] || 0) + 1;
    });
    var langs = Object.keys(counts).sort(function (a, b) {
        if (a === config.language) return -1;
        if (b === config.language) return 1;
        return counts[b] - counts[a];
    });
    if (langs.length <= 1) return config.language;
    return langs;
}

hexo.extend.helper.register('seo_jsonld', function (page) {
    var config = this.config;
    var self = this;
    var siteUrl = config.url.replace(/\/$/, '');
    var aboutUrl = siteUrl + '/about/';
    var authorId = aboutUrl + '#person';
    var siteId = siteUrl + '/#website';

    // Profile facts live in _config.yml (author_profile) and must match what
    // the about page visibly says.
    var profile = config.author_profile || {};
    var person = {
        '@type': 'Person',
        '@id': authorId,
        name: config.author,
        url: aboutUrl
    };
    if (profile.description) person.description = String(profile.description).trim();
    if (profile.image) {
        var avatar = normalizeImgur(String(profile.image));
        person.image = /^https?:\/\//.test(avatar) ? avatar : this.full_url_for(avatar);
    }
    if (profile.knows_about && profile.knows_about.length) person.knowsAbout = profile.knows_about;
    if (profile.knows_language && profile.knows_language.length) person.knowsLanguage = profile.knows_language;
    // sameAs must only list verified identity equivalents, never loose associations.
    if (config.same_as && config.same_as.length) person.sameAs = config.same_as;

    // A one-person blog: the author is also the publisher. Modelling the site
    // as an Organization would invent an entity that does not exist, and
    // Google's Article guidance does not ask for a publisher at all.
    var altName = plainName(config.title);
    var website = {
        '@type': 'WebSite',
        '@id': siteId,
        url: siteUrl + '/',
        name: config.title,
        alternateName: altName,
        description: siteSummary(config),
        inLanguage: siteLanguages(this.site, config),
        author: { '@id': authorId },
        publisher: { '@id': authorId }
    };

    var graph = [website, person];

    // The about page is the author's profile, so mark it as such and point
    // it at the Person every post names as author.
    if (this.is_page() && page.path && this.full_url_for(page.path) === aboutUrl) {
        graph.push({
            '@type': 'ProfilePage',
            '@id': aboutUrl + '#profilepage',
            url: aboutUrl,
            name: stripHtml(page.title || ''),
            inLanguage: page.lang || config.language,
            dateCreated: page.date ? page.date.toISOString() : undefined,
            dateModified: page.updated ? page.updated.toISOString() : undefined,
            isPartOf: { '@id': siteId },
            mainEntity: { '@id': authorId }
        });
    }

    if (this.is_post()) {
        var url = this.full_url_for(page.path);
        var image = this.seo_image(page);
        var text = stripHtml(page.content || '');
        var keywords = keywordsOf(page, config);

        var posting = {
            '@type': 'BlogPosting',
            '@id': url + '#article',
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            url: url,
            headline: truncate(stripHtml(page.title || ''), 110),
            description: describe(page, config),
            inLanguage: page.lang || config.language,
            datePublished: page.date ? page.date.toISOString() : undefined,
            dateModified: (page.updated || page.date) ? (page.updated || page.date).toISOString() : undefined,
            author: { '@id': authorId },
            publisher: { '@id': authorId },
            isPartOf: { '@id': siteId }
        };
        if (image) posting.image = image;
        if (keywords) posting.keywords = keywords.split(/\s*,\s*/).filter(Boolean);
        // CJK text has no spaces, so word counting falls back to characters.
        if (text) posting.wordCount = isCJK(text) ? text.length : text.split(/\s+/).length;

        graph.push(posting);

        var crumbs = [{
            '@type': 'ListItem',
            position: 1,
            name: config.title,
            item: siteUrl + '/'
        }];
        var cats = page.categories && page.categories.length
            ? (typeof page.categories.toArray === 'function' ? page.categories.toArray() : page.categories)
            : [];
        if (cats.length) {
            crumbs.push({
                '@type': 'ListItem',
                position: 2,
                name: cats[0].name || cats[0],
                item: cats[0].path ? self.full_url_for(cats[0].path) : undefined
            });
        }
        crumbs.push({
            '@type': 'ListItem',
            position: crumbs.length + 1,
            name: stripHtml(page.title || ''),
            item: url
        });

        graph.push({
            '@type': 'BreadcrumbList',
            '@id': url + '#breadcrumb',
            itemListElement: crumbs
        });
    }

    var jsonld = { '@context': 'https://schema.org', '@graph': graph };
    // </script> inside a JSON string would close the tag early.
    return '<script type="application/ld+json">'
        + JSON.stringify(jsonld).replace(/</g, '\u003c')
        + '</script>';
});
