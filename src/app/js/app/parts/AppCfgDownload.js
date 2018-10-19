export default class AppCfgDownload {
    constructor() {
        this.downloadTypeSwitcher = null;
    }

    init() {
        this.downloadTypeSwitcher = Array.from(document.querySelectorAll('input[name="downloadType"]'));
        this.initDownloadTypeSwitcher();
    }

    initDownloadTypeSwitcher() {
        this.downloadTypeSwitcher.forEach(switcher => {
            if (switcher.checked) {
                this.downloadType = switcher.value;
            }
            switcher.addEventListener('change', evt => {
                const that = evt.target;

                if (that.checked) {
                    this.downloadType = that.value;
                }
            });
        });
    }
}