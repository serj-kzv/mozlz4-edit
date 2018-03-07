class SaveWithLinkFileUtil extends FileUtil {
    static saveData(content, fileName) {
        this.saveAsDataWithLink(content, 'application/octet-stream', false, fileName);
    }

    static openAsJson(content) {
        this.saveAsDataWithLink(content, 'application/json', true, null);
    }
}