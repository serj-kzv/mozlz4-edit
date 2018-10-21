import ModalPlugin from '../../lib/app/modal/ModalPlugin.js';
import OPTION_API from '../../lib/app/OptionApi.js';
import TabPlugin from '../../lib/app/tab/TabPlugin.js';
import WEB_EXT_API from '../../lib/app/WebExtApi.js';
import {APP} from '../App.js';

export default class AppCfgEngine {
    constructor() {
        this.codeMirrorEngineList = null;
    }

    static async build() {
        const appCfg = new AppCfgEngine();

        await appCfg.init();

        return appCfg;
    }

    async init() {
        this.initEngineListEditor();
        await this.initEngineCfgBtn();
        this.initFormatCfgEngineListBtn();
        await this.initResetCfgEngineListBtn();
        this.initSaveCfgEngineListBtn();
    }

    initEngineListEditor() {
        this.codeMirrorEngineList = CodeMirror.fromTextArea(
            document.querySelector('#cfgEngineList'),
            {
                mode: "javascript",
                theme: "liquibyte",
                lineNumbers: true,
                viewportMargin: Infinity,
                maxHighlightLength: Infinity,
                styleActiveLine: true,
                matchBrackets: true
            }
        );
    }

    async initEngineCfgBtn() {
        const that = this;

        new ModalPlugin('engineCfgBtn', 'engineCfgModal', {
            onClose: () => that.clrCfgEngineList(),
            onOpen: () => that.updCfgEngineList()
        });
        new TabPlugin('#tabContainer2');
    }

    updCfgEngineList(jsonObj) {
        if (jsonObj === undefined) {
            this.codeMirrorEngineList.setValue(JSON.stringify(APP.ctx.appCfg.engineExamples, null, 4));
        } else {
            this.codeMirrorEngineList.setValue(JSON.stringify(jsonObj, null, 4));
        }
    }

    clrCfgEngineList() {
        this.codeMirrorEngineList.setValue('');
    }

    formatCfgEngineList() {
        const txt = this.codeMirrorEngineList.getValue();

        try {
            const json = JSON.parse(txt);

            this.updCfgEngineList(json);
        } catch (e) {
            alert('Error. JSON is invalid.');
        }
    }

    getCfgEngineList() {
        try {
            return JSON.parse(this.codeMirrorEngineList.getValue());
        } catch (e) {
            throw e;
        }
    }

    initFormatCfgEngineListBtn() {
        document.querySelector('#formatCfgEngineListBtn').addEventListener('click', () => this.formatCfgEngineList());
    }

    async initResetCfgEngineListBtn() {
        document.querySelector('#resetCfgEngineListBtn').addEventListener('click', async () => {
            await APP.ctx.appCfg.initEngineExamples();
            this.updCfgEngineList();

            if (WEB_EXT_API.isWebExt) {
                await this.saveCfgEngineList();
            }
        });
    }

    initSaveCfgEngineListBtn() {
        const saveCfgEngineListBtn = document.querySelector('#saveCfgEngineListBtn');

        if (WEB_EXT_API.isWebExt) {
            saveCfgEngineListBtn.addEventListener('click', () => {
                this.saveCfgEngineList();
            });
        } else {
            saveCfgEngineListBtn.disabled = true
        }
    }

    async saveCfgEngineList() {
        try {
            const engineExamples = APP.ctx.appCfg.engineExamples = this.getCfgEngineList();

            await OPTION_API.saveEngineExamples(engineExamples);
        } catch (e) {
            alert('Error. JSON is invalid.');
        }
    }
}