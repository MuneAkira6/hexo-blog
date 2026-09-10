/**
* Image Filter
* @description Lazy-load in-post images and point them at the imgur CDN directly.
*              The first image is left eager because it is the likely LCP element.
*/
hexo.extend.filter.register('after_post_render', function (data) {
    var first = true;

    function process (html) {
        return html.replace(/<img\b[^>]*>/gi, function (tag) {
            // imgur.com/<id>.<ext> 302-redirects; the extra hop delays rendering.
            tag = tag.replace(
                /(src=["'])https?:\/\/(?:www\.)?imgur\.com\/([A-Za-z0-9]+\.(?:jpg|jpeg|png|gif|webp))/i,
                '$1https://i.imgur.com/$2'
            );
            if (first) {
                first = false;
                return tag;
            }
            if (!/\bloading=/i.test(tag)) {
                tag = tag.replace(/<img\b/i, '<img loading="lazy"');
            }
            if (!/\bdecoding=/i.test(tag)) {
                tag = tag.replace(/<img\b/i, '<img decoding="async"');
            }
            return tag;
        });
    }

    data.content = process(data.content || '');
    return data;
});
