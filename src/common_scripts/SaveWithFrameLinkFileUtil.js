class SaveWithFrameLinkFileUtil {
    static async saveData(content, fileName) {
        this.saveAsData(content, 'octet/stream', false, fileName);
    }

    static async openAsJson(content) {
        this.saveAsData(content, 'application/json', true, null);
    }

    static async saveAsData(content, type, isNewTab, fileName) {
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style = 'display: none';

        const url = window.URL.createObjectURL(new Blob([content], {type}));

        a.href = url;
        a.target = isNewTab ? '_blank' : '_self';
        if (fileName != null) {
            a.download = fileName;
        }
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();



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