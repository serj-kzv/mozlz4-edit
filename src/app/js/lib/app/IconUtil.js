class IconUtil {
    static createSvgIcon(name) {
        if (name.length > IconUtil.cfg().maxLength) {
            throw `Max length is ${IconUtil.cfg().maxLength}`;
        }

        const maxTopLen = 3;
        const areThereTwoLines = name.length > maxTopLen;
        const topName = areThereTwoLines ? name.substr(0, maxTopLen) : name;
        const bottomName = areThereTwoLines ? name.substr(maxTopLen) : '';

        console.log(bottomName);

        return `<svg   xmlns="http://www.w3.org/2000/svg" 
                            height="${IconUtil.cfg().size}"
                            width="${IconUtil.cfg().size}">
                        <text>
                            <tspan
                                style="font-size: 22px;"
                                x="0" y="${areThereTwoLines ? IconUtil.cfg().secondY : IconUtil.cfg().size}">
                                ${topName}
                            </tspan>
                            <tspan
                                style="font-size: 11px;"
                                x="0" y="${IconUtil.cfg().size}">
                                ${areThereTwoLines ? bottomName : ''}
                            </tspan>
                        </text>
                    </svg>`;
    }

    static cfg() {
        const c = Object.create(null);

        c.maxLength = 6;
        c.size = 22;
        c.secondY = c.size / 2;

        return Object.freeze(c);
    }
}