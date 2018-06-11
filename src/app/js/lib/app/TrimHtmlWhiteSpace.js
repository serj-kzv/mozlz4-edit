class TrimHtmlWhiteSpace {
    static trim(parent) {
        Array.from(parent.childNodes).forEach(node => {
            if (node.nodeType === 3 && !/\S/.test(node.nodeValue)) {
                parent.replaceChild(document.createTextNode(''), node);
            } else if (node.nodeType !== 3) {
                TrimHtmlWhiteSpace.trim(node);
            }
        });
    }
}