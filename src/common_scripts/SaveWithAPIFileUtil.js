class SaveWithAPIFileUtil extends FileUtil {
    static saveData(content, fileName) {
        this.saveAsDataWithAPI(content, 'octet/stream', false, fileName);
    }

    static openAsJson(content) {
        this.saveAsDataWithAPI(content, 'application/json', true, null);
    }
}