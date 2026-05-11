const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const contentDir = "src/content";
const layoutPath = "src/layouts/base.html";
const distDir = "dist";

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

fs.cpSync("src/assets", "dist/assets", { recursive: true });

function replaceYouTubeLinks(markdown) {
    const youtubeRegex =
        /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/g;

    return markdown.replace(youtubeRegex, (match, videoId) => {
        return `
<div class="youtube-embed">
  <iframe
    width="560"
    height="315"
    src="https://www.youtube.com/embed/${videoId}"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>
`;
    });
}

const layout = fs.readFileSync(layoutPath, "utf8");

for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith(".md")) continue;

    const name = path.basename(file, ".md");

    let markdown = fs.readFileSync(
        path.join(contentDir, file),
        "utf8"
    );

    markdown = replaceYouTubeLinks(markdown);

    const htmlContent = marked(markdown);

    const version = Date.now();

    const finalHtml = layout
      .replace("{{ content }}", htmlContent)
      .replace("{{ title }}", `<title>${name}</title>`)
      // force CSS reload after each deploy to combat browser caching
      .replace(
        "/assets/style.css",
        `/assets/style.css?v=${version}`
      );

    fs.writeFileSync(
        path.join(distDir, `${name}.html`),
        finalHtml
    );
}

fs.copyFileSync(
    "src/index.html",
    "dist/index.html"
);
