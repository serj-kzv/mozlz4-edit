class IconUtil {
    static getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    static f1(txt, fontSize, width, height) {
        let rowQ, columnQ, imgH, imgW, imgS, rowSymbolQ, symbolQ, symbolS;

        fontSize += 0.3; // TODO: beautify code
        do {
            fontSize -= 0.3;
            rowQ = Math.floor(width / fontSize);
            imgH = Math.ceil(rowQ * fontSize);
            columnQ = Math.floor(height / fontSize);
            imgW = Math.ceil(columnQ * fontSize);
            imgS = Math.floor(imgH * imgW);
            symbolS = Math.pow(fontSize, 2);
            symbolQ = Math.floor(imgS / symbolS);
        } while (symbolQ < txt.length);

        return { fontSize, rowQ, columnQ, imgH, imgW, imgS, symbolQ, symbolS };
    }

    static txtToSvg(txt, width, height, fontSize = 1200) {
        const props = IconUtil.f1(txt, fontSize, width, height);
        console.log(props);
        const rows = txt.match(new RegExp(`(.|[\r\n]){1,${props.rowQ}}`, 'g'));
        let size = props.imgH;

        fontSize = `font-size: ${props.rowH};`;

        const tmplOfRows = rows.map(row => {
            const tmpl = `<tspan style="${fontSize} font-family: monospace;"
                            x="0" y="${size}">
                            ${row}
                          </tspan>`;

            size -= props.fontSize;

            return tmpl;
        }).join('');

        console.log(rows);

        return `<svg xmlns="http://www.w3.org/2000/svg" 
                    height="${height}" width="${width}">
                        <text>
                            ${tmplOfRows}
                        </text>
                </svg>`;
    }
}