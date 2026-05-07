const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

const contentDir = "src/content";
const layoutPath = "src/layouts/base.html";
const distDir = "dist";

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

fs.cpSync("src/assets", "dist/assets", { recursive: true });

const layout = fs.readFileSync(layoutPath, "utf8");

for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith(".md")) continue;

    const markdown = fs.readFileSync(
        path.join(contentDir, file),
        "utf8"
    );

    const htmlContent = marked(markdown);

    const finalHtml = layout.replace(
        "{{ content }}",
        htmlContent
    ).replace(
        "{{ title }}",
        "<title>${name}</title>"
    );

    const name = path.basename(file, ".md");

//    const outDir = path.join(distDir, name);
//    fs.mkdirSync(outDir, { recursive: true });

    fs.writeFileSync(
        path.join(distDir, "${name}.html"),
        finalHtml
    );
}

fs.copyFileSync(
    "src/index.html",
    "dist/index.html"
);