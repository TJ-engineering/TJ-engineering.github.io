const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, document.baseURI);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

function card(project) {
  const node = element('article', `card${project.featured ? ' featured' : ''}`);
  const top = element('div', 'card-top');
  top.append(element('span', '', project.category), element('span', '', `${project.featured ? 'Featured · ' : ''}${project.status}`));
  node.append(top);
  const logoUrl = safeUrl(project.logo?.src);
  if (logoUrl) {
    const logo = element('img', 'project-logo');
    logo.alt = project.logo.alt || `${project.title} logo`;
    logo.loading = 'lazy';
    logo.addEventListener('error', () => logo.remove());
    logo.src = logoUrl;
    node.append(logo);
  }
  node.append(element('h3', '', project.title), element('p', '', project.summary));
  const tags = element('div', 'tags');
  project.tags.forEach(tag => tags.append(element('span', 'tag', tag)));
  node.append(tags);
  const links = element('div', 'links');
  for (const [label, value] of [['View project ↗', project.url], ['Source ↗', project.repository]]) {
    const href = safeUrl(value);
    if (href) {
      const link = element('a', '', label);
      link.href = href;
      links.append(link);
    }
  }
  if (links.childElementCount) node.append(links);
  const resources = element('ul', 'resources');
  for (const resource of project.resources || []) {
    const href = safeUrl(resource.url);
    if (!href) continue;
    const item = element('li');
    const link = element('a', '', resource.title);
    link.href = href;
    item.append(link);
    if (resource.type) item.append(element('span', 'resource-type', resource.type));
    resources.append(item);
  }
  if (resources.childElementCount) {
    node.append(element('h4', 'resources-heading', 'Read more'), resources);
  }
  return node;
}

async function init() {
  const message = document.querySelector('#message');
  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { site, projects } = await response.json();
    const statuses = ['planned', 'active', 'available', 'completed', 'archived'];
    if (!site || !Array.isArray(projects) || projects.some(p =>
      !p || !['id', 'title', 'summary', 'category'].every(key => typeof p[key] === 'string' && p[key].trim()) ||
      !statuses.includes(p.status) || !Array.isArray(p.tags) || p.tags.some(t => typeof t !== 'string') ||
      (p.logo != null && (typeof p.logo.src !== 'string' || typeof p.logo.alt !== 'string')) ||
      (p.resources != null && (!Array.isArray(p.resources) || p.resources.some(r =>
        !r || typeof r.title !== 'string' || typeof r.url !== 'string' ||
        (r.type != null && typeof r.type !== 'string'))))
    )) throw new Error('Invalid project data');
    document.title = `${site.name} | Projects`;
    document.querySelector('#headline').textContent = site.tagline;
    document.querySelector('#intro').textContent = site.description;
    const githubUrl = safeUrl(site.githubUrl);
    if (githubUrl) document.querySelector('#github').href = githubUrl;
    const search = document.querySelector('#search');
    const category = document.querySelector('#category');
    const status = document.querySelector('#status');
    [...new Set(projects.map(p => p.category))].sort().forEach(value => {
      const option = element('option', '', value);
      option.value = value;
      category.append(option);
    });
    function render() {
      const query = search.value.trim().toLowerCase();
      const visible = projects.filter(p =>
        (!category.value || p.category === category.value) &&
        (!status.value || p.status === status.value) &&
        [p.title, p.summary, p.category, ...p.tags].join(' ').toLowerCase().includes(query)
      ).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
      document.querySelector('#projects').replaceChildren(...visible.map(card));
      document.querySelector('#count').textContent = `${visible.length} of ${projects.length} projects`;
      message.textContent = visible.length ? '' : 'No projects match. Try another search or filter.';
      message.hidden = visible.length > 0;
    }
    search.addEventListener('input', render);
    category.addEventListener('change', render);
    status.addEventListener('change', render);
    render();
  } catch (error) {
    message.hidden = false;
    message.textContent = 'Could not load projects. Serve this folder over HTTP and check data/projects.json.';
    console.error(error);
  }
}
init();
