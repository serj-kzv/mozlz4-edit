const saveAsDataIframeFn = (content, type, isNewTab, filename) => {
    const id = 'SaveFileUtil-browserSaveAsData-iframe';
    let iframe = document.querySelector(`#${id}`);

    if (iframe != null) {
        window.URL.revokeObjectURL(iframe.src);
        iframe.remove();
    }
    iframe = document.createElement('iframe');
    iframe.id = id;
    iframe.style.display = 'none';

    const url = window.URL.createObjectURL(new Blob([content], {type}));

    iframe.src = url;
    document.body.appendChild(iframe);

    // TODO: research whether it's right way to call window.URL.revokeObjectURL
    window.URL.revokeObjectURL(url);

    return url;
};

export default saveAsDataIframeFn;
