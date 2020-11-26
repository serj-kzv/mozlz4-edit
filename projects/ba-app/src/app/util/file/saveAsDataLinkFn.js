const saveAsDataLinkFn = (content, type, isNewTab, filename) => {
    const id = 'SaveFileUtil-browserSaveAsData-link';
    let a = document.querySelector(`#${id}`);

    if (a != null) {
        window.URL.revokeObjectURL(a.href);
        a.remove();
    }
    a = document.createElement('a');
    a.id = id;
    a.style.display = 'none';
    document.body.appendChild(a);

    const url = window.URL.createObjectURL(new Blob([content], {type}));

    a.href = url;
    a.download = filename; // gives it a name via an a tag
    a.click();

    // TODO: research whether it's right way to call window.URL.revokeObjectURL
    window.URL.revokeObjectURL(url);

    return url;
};

export default saveAsDataLinkFn;
