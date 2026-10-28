const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const canonical = 'https://aditi727.github.io/automation-portfolio/';

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.planning' || entry.name === 'qa') continue;
    const full = path.join(directory, entry.name);
    const stat = fs.lstatSync(full);
    assert.equal(stat.isSymbolicLink(), false, `public tree contains symlink: ${full}`);
    if (entry.isDirectory()) walk(full, files);
    else files.push(path.relative(root, full));
  }
  return files;
}

test('public tree uses an explicit allowlist and contains no private source', () => {
  const expected = [
    '.gitignore', '.nojekyll', '404.html', 'README.md',
    'assets/favicon.svg', 'assets/inbox-priority-alert.png', 'assets/lead-rescue-workflow.png',
    'assets/rabbitmq-architecture.png', 'assets/telegram-actions.png',
    'index.html', 'robots.txt', 'script.js', 'sitemap.xml', 'styles.css',
    'tests/security.test.js', 'tests/site.test.js',
  ];
  assert.deepEqual(walk(root).sort(), expected);
});

test('GitHub Pages metadata and fallback paths use the exact public HTTPS URL', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const notFound = fs.readFileSync(path.join(root, '404.html'), 'utf8');
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}">`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${canonical}">`));
  assert.match(html, /<meta property="og:image" content="https:\/\/aditi727\.github\.io\/automation-portfolio\/assets\/lead-rescue-workflow\.png">/);
  assert.match(notFound, /href="\/automation-portfolio\/"/);
  assert.match(robots, /Sitemap: https:\/\/aditi727\.github\.io\/automation-portfolio\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/aditi727\.github\.io\/automation-portfolio\/<\/loc>/);
  assert.ok(fs.existsSync(path.join(root, '.nojekyll')));
});

test('public text contains no secrets, local paths, trackers, or private identifiers', () => {
  const textFiles = walk(root).filter((file) =>
    /\.(?:html|css|js|md|txt|xml|svg)$/.test(file) && !file.startsWith('tests/'));
  const content = textFiles.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  const forbidden = [
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
    /\bBearer\s+[A-Za-z0-9._-]{20,}\b/i,
    /\b(?:sk|pat)-[A-Za-z0-9_-]{20,}\b/i,
    /GOCSPX-[A-Za-z0-9_-]{20,}/,
    /\b\d{6,12}:[A-Za-z0-9_-]{30,}\b/,
    /\/Users\/|localhost|127\.0\.0\.1|ngrok|trycloudflare/i,
    /Aditi Gadhvi/i,
    /google-analytics|googletagmanager|segment\.com|mixpanel|hotjar/i,
  ];
  for (const pattern of forbidden) assert.doesNotMatch(content, pattern);
  assert.doesNotMatch(content, /\.env|database\.sqlite|workflow-0[1-6]/i);
});

test('Git history uses only the public brand identity', () => {
  const identities = execFileSync('git', ['log', '--format=%an|%ae|%cn|%ce'], { cwd: root, encoding: 'utf8' }).trim().split('\n');
  for (const identity of identities) {
    assert.equal(identity, 'Automation Portfolio|Aditi727@users.noreply.github.com|Automation Portfolio|Aditi727@users.noreply.github.com');
  }
});
