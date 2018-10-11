export default class IconUtil {
    static getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

    static fontProps(txt, fontSize, width, height) {
        let rowQ, columnQ, imgH, imgW, imgS, rowSymbolQ, symbolQ, symbolS;

        fontSize += 0.3; // TODO: beautify the code
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
        const props = IconUtil.fontProps(txt, fontSize, width, height);
        const rows = txt.match(new RegExp(`(.|[\r\n]){1,${props.rowQ}}`, 'g'));
        let size = 0;

        fontSize = `font-size: ${props.fontSize}px;`;

        const tmplOfRows = rows.map(row => {
            return `<tspan style="${fontSize} font-family: monospace;"
                            x="0" y="${size += props.fontSize}">
                            ${row}
                          </tspan>`;
        }).join('');

        return `<svg xmlns="http://www.w3.org/2000/svg" 
                    height="${height}" width="${width}">
                        <text>
                            ${tmplOfRows}
                        </text>
                </svg>`;
    }
}