import fs from "fs";
import svg2ttf from "svg2ttf";
import SVGIcons2SVGFontStream from "svgicons2svgfont";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";

interface Glyph {
    icon_id: string;
    name: string;
    font_class: string;
    unicode: string;
    unicode_decimal: string;
}

interface Config {
    id: string;
    name: string;
    font_family: string;
    css_prefix_text: string;
    description: string;
    glyphs: Array<Glyph>;
}

let config = <Config>JSON.parse(fs.readFileSync("./iconfont/iconfont.json", "utf8"));

let glyphMap = new Map<string, Glyph>();
for (let glyph of config.glyphs) {
    let key = glyph.unicode.toLowerCase();
    glyphMap.set(key, glyph);
}

let fontStream = new SVGIcons2SVGFontStream({
    fontName: config.font_family
});

fontStream
    .pipe(fs.createWriteStream("./iconfont/iconfont.svg"))
    .on('finish', () => {

        let ttfData = Buffer.from(svg2ttf(fs.readFileSync("./iconfont/iconfont.svg", "utf8"), {}).buffer);

        fs.writeFileSync("./iconfont/iconfont.ttf", ttfData);
        fs.writeFileSync("./iconfont/iconfont.woff", ttf2woff(ttfData, {}));
        fs.writeFileSync("./iconfont/iconfont.woff2", ttf2woff2(ttfData));

        let css = "";
        let now = new Date().getTime();

        css += `@font-face {\r\n`;
        css += `  font-family: "${config.font_family}";\r\n`;
        css += `  src: url('iconfont.woff2?t=${now}') format('woff2'),\r\n`;
        css += `       url('iconfont.woff?t=${now}') format('woff'),\r\n`;
        css += `       url('iconfont.ttf?t=${now}') format('truetype');\r\n`;
        css += `}\r\n\r\n`;

        css += `.iconfont {\r\n`;
        css += `  font-family: "${config.font_family}" !important;\r\n`;
        css += `  font-size: 16px;\r\n`;
        css += `  font-style: normal;\r\n`;
        css += `  -webkit-font-smoothing: antialiased;\r\n`;
        css += `  -moz-osx-font-smoothing: grayscale;\r\n`;
        css += `}\r\n\r\n`;

        for (let glyph of config.glyphs) {
            css += `.${config.css_prefix_text}${glyph.font_class}:before {\r\n`;
            css += `  content: "\\${glyph.unicode}";\r\n`;
            css += `}\r\n\r\n`;
        }

        fs.writeFileSync("./iconfont/iconfont.css", css);
        console.log('Font successfully created!');

    })
    .on('error', (err) => {
        console.log(err);
    });

for (let glyph of config.glyphs) {

    let glyph1 = <any>fs.createReadStream("./iconfont/icons/" + glyph.name + ".svg");

    glyph1.metadata = {
        unicode: [String.fromCharCode(parseInt(glyph.unicode, 16))],
        name: "uni" + glyph.unicode.toUpperCase(),
    };

    fontStream.write(glyph1);
}

fontStream.end();
