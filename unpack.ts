import fs from "fs";
import ttf2svg from "ttf2svg";
import svgfont2svgicons from "svgfont2svgicons";

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

let ttfData = fs.readFileSync("./iconfont/iconfont.ttf");
fs.writeFileSync("./iconfont/iconfont.svg", ttf2svg(ttfData));
let fontStream = fs.createReadStream("./iconfont/iconfont.svg");
let iconProvider = svgfont2svgicons();

fontStream.pipe(iconProvider);
iconProvider.on('readable', () => {

    let icon;
    do {

        icon = iconProvider.read();
        if (icon) {

            let unicode = icon.metadata.unicode[0].charCodeAt().toString(16);
            let key = unicode.toLowerCase();

            if (glyphMap.has(key)) {

                let glyph = glyphMap.get(key);
                console.log('New icon:', glyph.name, glyph.unicode);
                icon.pipe(fs.createWriteStream("./iconfont/icons/" + glyph.name + '.svg'));
            }
        }

    } while (null !== icon);

}).once('end', () => {

    console.log('No more icons !')
});
