const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('uses the privacy-safe Automation Portfolio brand in public metadata and hero', () => {
  const html = read('index.html');
  assert.match(html, /<title>Automation Portfolio \| AI &amp; Automation Workflow Developer<\/title>/);
  assert.match(html, /<meta name="description" content="Practical n8n automation, AI workflows, APIs, webhooks, Gmail, Google Sheets, Telegram and event-driven integrations\.">/);
  assert.match(html, /<meta property="og:title" content="Automation Portfolio">/);
  assert.match(html, /<meta property="og:site_name" content="Automation Portfolio">/);
  assert.match(html, /<h1[^>]*>\s*Automation Portfolio\s*<\/h1>/);
  assert.match(html, /AI &amp; Automation Workflow Developer/);
});

test('presents all five verified projects with truthful boundaries', () => {
  const html = read('index.html');
  const projects = [
    ['lead-rescue', 'AI Lead Response &amp; SLA Automation'],
    ['telegram-ops', 'Telegram AI Operations &amp; CRM Assistant'],
    ['inbox-assistant', 'AI Executive Inbox &amp; Human Approval Assistant'],
    ['webhook-crm', 'Webhook Lead Intake &amp; Multi-Channel CRM'],
    ['rabbitmq-ops', 'AI Event-Driven Customer Operations'],
  ];
  for (const [id, title] of projects) {
    assert.match(html, new RegExp(`data-project="${id}"`));
    assert.match(html, new RegExp(title));
  }
  assert.match(html, /Verified Demo Mode/);
  assert.match(html, /live OpenAI and HubSpot validation remains pending/i);
  assert.match(html, /draft-only|drafts for human review/i);
  assert.match(html, /portfolio demo/i);
});

test('lists only demonstrated technologies and separates CRM expansion', () => {
  const html = read('index.html');
  for (const technology of ['n8n', 'JavaScript', 'Node.js', 'REST APIs', 'Webhooks', 'Gemini', 'Google Sheets', 'Gmail', 'Telegram', 'RabbitMQ', 'Git / GitHub', 'Docker']) {
    assert.match(html, new RegExp(`>${technology.replace('/', '\\/')}<`));
  }
  assert.match(html, /Currently expanding CRM automation skills with HubSpot and GoHighLevel\./);
  assert.equal((html.match(/Currently expanding CRM automation skills/g) || []).length, 1);
});

test('uses semantic landmarks and GitHub as the only public contact method', () => {
  const html = read('index.html');
  for (const tag of ['header', 'nav', 'main', 'footer']) assert.match(html, new RegExp(`<${tag}[\\s>]`));
  for (const id of ['projects', 'process', 'stack', 'contact']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /href="https:\/\/github\.com\/Aditi727"/);
  assert.doesNotMatch(html, /mailto:|tel:/i);
});

test('contains no personal identity, local runtime reference, or inflated claim', () => {
  const publicText = [read('index.html'), read('README.md')].join('\n');
  assert.doesNotMatch(publicText, /Aditi Gadhvi/i);
  assert.doesNotMatch(publicText, /\/Users\/|localhost|127\.0\.0\.1|trycloudflare|ngrok-free/i);
  assert.doesNotMatch(publicText, /world-class|years of experience|enterprise architect|guaranteed results|paying client/i);
  assert.doesNotMatch(publicText, /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
  assert.doesNotMatch(publicText, /\+?\d[\d\s().-]{8,}\d/);
});

test('documents the public-only repository boundary', () => {
  const readme = read('README.md');
  assert.match(readme, /static GitHub Pages portfolio/i);
  assert.match(readme, /synthetic/i);
  assert.match(readme, /private automation repository is not published/i);
  assert.match(readme, /RabbitMQ.*Demo Mode/is);
});

test('provides a responsive accessible visual system without gradients or remote fonts', () => {
  const css = read('styles.css');
  const html = read('index.html');
  assert.match(css, /--radius:\s*8px/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(max-width:\s*980px\)/);
  assert.match(css, /@media\s*\(max-width:\s*680px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /max-width:\s*100%/);
  assert.match(css, /min-height:\s*clamp\(/);
  assert.doesNotMatch(css, /gradient\(/i);
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/i);
});

test('adds progressive navigation and image preview behavior while keeping content in HTML', () => {
  const js = read('script.js');
  const html = read('index.html');
  assert.match(js, /aria-expanded/);
  assert.match(js, /showModal/);
  assert.match(js, /Escape/);
  assert.match(html, /<button class="nav-toggle"[^>]+aria-controls="nav-links"/);
  assert.match(html, /<dialog class="image-dialog"/);
  assert.equal((html.match(/<article class="project/g) || []).length, 5);
  assert.doesNotMatch(html, /onclick=|style=/i);
});
