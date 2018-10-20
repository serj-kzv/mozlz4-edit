import OPTION_API from '../../lib/app/OptionApi.js';
import WEB_EXT_API from '../../lib/app/WebExtApi.js';

export default class AppCfgDownload {
    constructor() {
        this.downloadTypeSwitcher = null;
    }

    static async build() {
        const inst = new AppCfgDownload();

        await inst.init();

        return inst;
    }

    async init() {
        this.downloadTypeSwitcher = Array.from(document.querySelectorAll('input[name="downloadType"]'));
        this.initDownloadTypeSwitcher();
    }

    initDownloadTypeSwitcher() {
        this.downloadTypeSwitcher.forEach(switcher => {
            switcher.addEventListener('change', evt => {
                const that = evt.target;

                if (that.checked) {
                    OPTION_API.saveDownloadType(this.downloadType = that.value);
                }
            });
        });
        if (!WEB_EXT_API.isWebExt) {
            for (const switcher of this.downloadTypeSwitcher) {
                switch (true) {
                    case switcher.value === 'browserLink': {
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