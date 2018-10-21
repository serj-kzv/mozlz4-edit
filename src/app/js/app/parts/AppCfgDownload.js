import OPTION_API from '../../lib/app/OptionApi.js';
import WEB_EXT_API from '../../lib/app/WebExtApi.js';
import {APP} from '../App.js';

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
        await this.initDownloadTypeSwitcher();
    }

    async initDownloadTypeSwitcher() {
        if (WEB_EXT_API.isWebExt) {
            const downloadType = await OPTION_API.readDownloadType();

            this.downloadTypeSwitcher.find(switcher => switcher.value === downloadType).click();
        } else {
            // small optimization, radioCount > N has to break the loop, where N == ('quantity of case operators' - 1)
            let radioCount = 0;

            for (const switcher of this.downloadTypeSwitcher) {
                if (radioCount > 1) {
                    break;
                }
                switch (true) {
                    case switcher.value === 'browserLink': {
                        switcher.click();
                        radioCount++;
                        break;
                    }
                    case switcher.value === 'webExt': {
                        switcher.disabled = true;
                        radioCount++;
                        break;
                    }
                }
            }
        }
        this.downloadTypeSwitcher.forEach(switcher => {
            switcher.addEventListener('change', evt => {
                const that = evt.target;

                if (that.checked) {
                    APP.ctx.appCfg.downloadType = that.value;
                    if (WEB_EXT_API.isWebExt) {
                        OPTION_API.saveDownloadType(that.value);
                    }
                }
            });
        });
    }
}