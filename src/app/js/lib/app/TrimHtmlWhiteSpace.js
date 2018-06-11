class TrimHtmlWhiteSpace {
    static trim(parent) {
        const children = Array.from(parent.childNodes);
        const nodes = children.filter(node => node.nodeType !== 3);
        const textNodes = children.filter(node => node.nodeType === 3 && !/\S/.test(node.nodeValue));

        textNodes.forEach(node => parent.replaceChild(document.createTextNode(''), node));
        nodes.forEach(node => TrimHtmlWhiteSpace.trim(node));
    }
}