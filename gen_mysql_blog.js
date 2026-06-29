const fs = require('fs');
const marked = require('marked');

// Read the flutter blog as template (already has all the right CSS)
let template = fs.readFileSync('blog-flutter-roadmap.html', 'utf-8');

const md = fs.readFileSync('scratch_mysql.md', 'utf-8');

const title = 'MySQL Zero to Engineer: The Complete Roadmap';
const subtitle = 'Not just someone who writes queries — someone who understands MySQL deeply enough to design schemas, tune engines, build data layers, and make architectural decisions that scale.';
const date = 'Jun 28, 2026';
const readTime = '35 min read';
const category = 'Database Engineering';

// Build renderer with IDs on headings
const renderer = new marked.Renderer();
renderer.heading = function({text, depth}) {
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};
marked.use({ renderer });

// Build TOC from H2 headings
const tokens = marked.lexer(md);
let tocHtml = '';
tokens.forEach(token => {
  if (token.type === 'heading' && token.depth === 2) {
    const id = token.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    tocHtml += `<li class="toc-item"><a href="#${id}">${token.text}</a></li>\n`;
  }
});

// Sectionize content by H2
let sectionizedHtml = '';
let currentSection = '';
for (const token of tokens) {
  if (token.type === 'heading' && token.depth === 2) {
    if (currentSection) sectionizedHtml += currentSection + '\n</section>\n';
    const id = token.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    currentSection = `<section id="${id}" class="content-section">\n`;
    currentSection += `<div class="section-header"><h2>${token.text}</h2></div>\n`;
  } else {
    currentSection += marked.parse(token.raw);
  }
}
if (currentSection) sectionizedHtml += currentSection + '\n</section>\n';

// ----------- Patch template -----------

// 1. Title tag
template = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

// 2. Meta description
if (!template.includes('<meta name="description"')) {
  template = template.replace('</title>', `</title>\n  <meta name="description" content="${subtitle}">`);
}

// 3. Category
template = template.replace(
  /<span class="category">.*?<\/span>/,
  `<span class="category">${category}</span>`
);

// 4. Time/read — replace the time + read span block
template = template.replace(
  /<time datetime=".*?">.*?<\/time>\s*<span class="dot"[^>]*><\/span>\s*<span>.*?<\/span>/s,
  `<time datetime="2026-06-28">${date}</time>\n            <span class="dot" style="display:inline-block;width:4px;height:4px;background:var(--light-gray-70);border-radius:50%"></span>\n            <span>${readTime}</span>`
);

// 5. H1 blog title
template = template.replace(
  /<h1 class="blog-title">.*?<\/h1>/s,
  `<h1 class="blog-title">${title}</h1>`
);

// 6. Subtitle
template = template.replace(
  /<p class="blog-subtitle">[\s\S]*?<\/p>/,
  `<p class="blog-subtitle">\n            ${subtitle}\n          </p>`
);

// 7. Banner image
template = template.replace(
  /<img src="\.\/assets\/images\/blog-flutter-roadmap-banner\.png"[^>]*>/,
  `<img src="./assets/images/blog-mysql-roadmap-banner.png" alt="MySQL Zero to Engineer Roadmap Banner">`
);

// 8. TOC list
template = template.replace(
  /<ul class="toc-list" id="tocList">[\s\S]*?<\/ul>/,
  `<ul class="toc-list" id="tocList">\n${tocHtml}</ul>`
);

// 9. Main article content
const startMarker = '<div class="main-article-content">';
const endMarker = '<!-- Google AdSense: In-article ad -->';
const startIdx = template.indexOf(startMarker) + startMarker.length;
const endIdx = template.indexOf(endMarker);
if (startIdx > startMarker.length - 1 && endIdx > -1) {
  template = template.substring(0, startIdx) + '\n\n' + sectionizedHtml + '\n\n' + template.substring(endIdx);
}

fs.writeFileSync('blog-mysql-roadmap.html', template);
console.log('Generated blog-mysql-roadmap.html ✓');
