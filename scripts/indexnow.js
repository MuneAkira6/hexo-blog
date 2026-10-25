/**
* IndexNow Deployer
* @description Runs after the git deployer and tells IndexNow engines which URLs
*              were added, changed or removed since the last successful
*              submission, using the <lastmod> values in sitemap.xml. Bing (the
*              index behind Copilot and part of ChatGPT search) shares the
*              submissions with Yandex, Naver, Seznam and others. Google does not
*              take part in IndexNow.
*/
'use strict';

const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const STATE_FILE = '.indexnow-state.json';

function readSitemap (file) {
    const urls = {};
    const blocks = fs.readFileSync(file, 'utf8').match(/<url>[\s\S]*?<\/url>/g) || [];
    blocks.forEach(function (block) {
        const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(block);
        const lastmod = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/.exec(block);
        if (loc) urls[loc[1]] = lastmod ? lastmod[1] : '';
    });
    return urls;
}

function sleep (ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// GitHub Pages publishes a minute or so after the push, and the engines verify
// ownership by fetching the key file, so wait until it is actually live.
async function waitForKeyFile (url, key, log) {
    for (let i = 0; i < 30; i++) {
        try {
            // The query string sidesteps a CDN-cached 404 from before the push.
            const res = await fetch(url + '?t=' + Date.now());
            if (res.ok && (await res.text()).trim() === key) return true;
        } catch (e) { /* network hiccup: try again */ }
        if (i === 0) log.info('IndexNow: waiting for %s to go live', url);
        await sleep(10000);
    }
    return false;
}

hexo.extend.deployer.register('indexnow', async function (args) {
    const log = this.log;
    const opts = Object.assign({}, this.config.indexnow, args);
    const key = opts.key ? String(opts.key).trim() : '';
    if (!key) {
        log.warn('IndexNow: no key configured, skipped');
        return;
    }

    const siteUrl = this.config.url.replace(/\/$/, '');
    const keyUrl = siteUrl + '/' + key + '.txt';
    const statePath = path.join(this.base_dir, STATE_FILE);
    const current = readSitemap(path.join(this.public_dir, 'sitemap.xml'));

    let previous = {};
    try {
        previous = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    } catch (e) { /* first run: every URL counts as new */ }

    const changed = Object.keys(current).filter(function (u) { return previous[u] !== current[u]; });
    const removed = Object.keys(previous).filter(function (u) { return !(u in current); });
    const urlList = changed.concat(removed);

    if (!urlList.length) {
        log.info('IndexNow: no changed URLs');
        return;
    }
    if (opts.dry_run) {
        log.info('IndexNow (dry run): would submit %d URL(s)\n  %s', urlList.length, urlList.join('\n  '));
        return;
    }
    if (!(await waitForKeyFile(keyUrl, key, log))) {
        log.warn('IndexNow: %s is not live yet; will retry on the next deploy', keyUrl);
        return;
    }

    // The site is already pushed at this point, so a failed ping should warn,
    // not fail the deploy. The state is only saved on success, so the same URLs
    // are retried next time.
    try {
        const res = await fetch(opts.endpoint || ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            body: JSON.stringify({
                host: new URL(siteUrl).host,
                key: key,
                keyLocation: keyUrl,
                urlList: urlList
            })
        });
        // 200 = accepted, 202 = accepted while the key is still being verified.
        if (res.status === 200 || res.status === 202) {
            fs.writeFileSync(statePath, JSON.stringify(current, null, 2) + '\n');
            log.info('IndexNow: submitted %d URL(s) (HTTP %d)', urlList.length, res.status);
        } else {
            log.warn('IndexNow: HTTP %d %s; will retry on the next deploy', res.status, (await res.text()).slice(0, 200));
        }
    } catch (e) {
        log.warn('IndexNow: %s; will retry on the next deploy', e.message);
    }
});
