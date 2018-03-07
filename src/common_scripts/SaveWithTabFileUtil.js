class SaveWithTabFileUtil extends FileUtil {
    static saveData(content, fileName) {
        this.saveAsDataWithTab(content, 'octet/stream', false, fileName);
    }

    static openAsJson(content) {
        this.saveAsDataWithTab(content, 'application/json', true, null);
    }
}