export default class AppCfgDownload {
    constructor() {
        this.downloadTypeSwitcher = null;
        this.downloadType = null;
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

        this.setDefaultDownloadType();
    }

    // to work as a html page, we will set up default way to save the file
    setDefaultDownloadType() {
        if (typeof browser === 'undefined') {
            for (const switcher of this.downloadTypeSwitcher) {
                switch (true) {
                    case switcher.value === 'browserLink' : {
                        switcher.click();
                        break;
                    }
                    case switcher.value === 'webExt': {
                        switcher.disabled = true;
                        break;
                    }
                }
            }
        }
    }
}