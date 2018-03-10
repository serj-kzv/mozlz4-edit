class SaveWithTabFileUtil extends FileUtil {
    static async saveData(content, fileName) {
        this.saveAsData(content, 'octet/stream', false, fileName);
    }

    static async openAsJson(content) {
        this.saveAsData(content, 'application/json', true, null);
    }

    static async saveAsData(content, type, isNewTab, fileName) {
        const url = window.URL.createObjectURL(new Blob([content], {type}));
        const popupWindow = window.open(
            url,
            '',
            ''
        );

        popupWindow.addEventListener('unload', event => {
            window.URL.revokeObjectURL(url);
        });
        popupWindow.addEventListener('abort', event => {
            window.URL.revokeObjectURL(url);
        });
    }
}