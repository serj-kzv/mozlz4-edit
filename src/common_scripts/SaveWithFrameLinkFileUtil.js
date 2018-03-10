class SaveWithFrameLinkFileUtil extends FileUtil {
    static async saveData(content, fileName) {
        this.saveAsData(content, 'octet/stream', false, fileName);
    }

    static async openAsJson(content) {
        this.saveAsData(content, 'application/json', true, null);
    }

    // FIXME
    static async saveAsData(content, type, isNewTab, fileName) {

    }
}