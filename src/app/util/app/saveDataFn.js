const saveDataFn = (content, fileName, downloadingType = null) => {
    const CFG = SaveFileUtil.getCfg();

    if (downloadingType == null) {
        downloadingType = CFG.WEB_EXT;
    }
    switch (true) {
        case downloadingType === CFG.BROWSER_IFRAME: {
            return new Promise(resolve =>
                resolve(this.browserSaveAsDataIframe(content, 'octet/stream', false, fileName)));
        }
        case downloadingType === CFG.BROWSER_LINK: {
            return new Promise(resolve =>
                resolve(this.browserSaveAsDataLink(content, 'octet/stream', false, fileName)));
        }
        case downloadingType === CFG.WEB_EXT: {
            return this.webExtSaveAsData(content, 'octet/stream', false, fileName);
        }
    }

    return new Promise((resolve, reject) => reject('Error. Downloading type is wrong.'));
};

export default saveDataFn;
