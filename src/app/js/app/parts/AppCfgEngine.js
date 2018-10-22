import FileUtil from '../../lib/app/fileUtil/FileUtil.js';
import SaveFileUtil from '../../lib/app/fileUtil/SaveFileUtil.js';
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
        this.initCfgImportEngineListFileBtn();
        this.initCfgExportEngineListBtn();
        this.initCfgImportEngineListUrlBtn();
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
        new TabPlugin('#cfgTabContainer');
    }

    updCfgEngineList(jsonObj) {
        let formattedJson;

        if (jsonObj === undefined) {
            formattedJson = JSON.stringify(APP.ctx.appCfg.engineExamples, null, 4);
        } else {
            formattedJson = JSON.stringify(jsonObj, null, 4);
        }
        this.codeMirrorEngineList.setValue(formattedJson);

        return formattedJson;
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
            if (window.confirm('Are you sure that you want to reset the engine list?')) {
                await APP.ctx.appCfg.initEngineExamples();
                this.updCfgEngineList();

                if (WEB_EXT_API.isWebExt) {
                    await this.saveCfgEngineList();
                }
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

    initCfgImportEngineListFileBtn() {
        const cfgImportEngineListFileBtn = document.querySelector('#cfgImportEngineListFileBtn');

        if (WEB_EXT_API.isWebExt) {
            cfgImportEngineListFileBtn.addEventListener('change', async evt => {
                const fileTxt = await FileUtil.readFileAsTxt(evt.target.files[0]);

                try {
                    APP.ctx.appCfg.engineExamples = JSON.parse(fileTxt);
                    this.updCfgEngineList();
                } catch (jsonParseEx) {
                    alert('Error. JSON is invalid!');
                }
            });
        } else {
            cfgImportEngineListFileBtn.disabled = true;
            cfgImportEngineListFileBtn.parentElement.classList.add('disabled');
        }
    }

    initCfgExportEngineListBtn() {
        const cfgExportEngineListBtn = document.querySelector('#cfgExportEngineListBtn');

        if (WEB_EXT_API.isWebExt) {
            cfgExportEngineListBtn.addEventListener('click', async () => {
                const json = this.codeMirrorEngineList.getValue(), fileName = 'engines.json';

                try {
                    await SaveFileUtil.saveData(json, `${fileName}`, APP.ctx.appCfg.downloadType);
                } catch (e) {
                    alert(`An error! Possibly the file '${fileName}' is busy. Close programs that can use the file and try again.`);
                }
            });
        } else {
            cfgExportEngineListBtn.disabled = true;
        }
    }

    initCfgImportEngineListUrlBtn() {
        const cfgImportEngineListUrlBtn = document.querySelector('#cfgImportEngineListUrlBtn');

        if (WEB_EXT_API.isWebExt) {
            cfgImportEngineListUrlBtn.addEventListener('click', async () => {
                const url = window.prompt(
                    'Enter an URL to json that contains an engine list.',
                    APP.ctx.appCfg.engineExamples.defaultEngineListUrl
                );

                if (url == null) {
                    return;
                }

                let txt;

                try {
                    txt = await (await fetch(url)).text();

                    try {
                        const json = JSON.parse(txt);

                        this.updCfgEngineList(json);
                    } catch (e) {
                        alert('Error. JSON is invalid.');
                    }
                } catch (e) {
                    alert('Error. Something wrong with an URL!');
                }
            });
        } else {
            cfgImportEngineListUrlBtn.disabled = true;
        }
    }
}