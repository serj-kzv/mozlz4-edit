class TrimHtmlWhiteSpace {
    static trim(parent) {
        const rgEx = /\S/;

        Array.from(parent.childNodes).forEach(node => {
            if (node.nodeType === 3 && !rgEx.test(node.nodeValue)) {
                parent.replaceChild(document.createTextNode(''), node);
            } else if (node.nodeType !== 3) {
                TrimHtmlWhiteSpace.trim(node);
            }
        });
    }
}