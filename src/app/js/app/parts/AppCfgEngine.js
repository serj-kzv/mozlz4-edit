import BrowserApi from '../../lib/app/BrowserApi.js';
import ModalPlugin from '../../lib/app/modal/ModalPlugin.js';
import TabPlugin from '../../lib/app/tab/TabPlugin.js';

export default class AppCfgEngine {
    constructor() {
        this.engineExamples = null;
        this.codeMirrorEngineList = null;
    }

    static async build() {
        const appCfg = new AppCfgEngine();

        await appCfg.init();

        return appCfg;
    }

    async init() {
        await this.initCfgEngineList();
        await this.initCfgTmpl();
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

    async initEngineExamples() {
        const url = BrowserApi.getURL('app/resources/engines.json');

        return this.engineExamples = await (await fetch(url)).json();
    }

    async initCfgTmpl() {
        document.querySelector('#cfgContainer').innerHTML = await (
            await fetch(BrowserApi.getURL('app/cfg.htm'))
        ).text();
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
            this.codeMirrorEngineList.setValue(JSON.stringify(this.engineExamples, null, 4));
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
            await this.initEngineExamples();
            this.updCfgEngineList();

            if (typeof browser !== 'undefined') {
                await this.saveCfgEngineList();
            }
        });
    }

    initSaveCfgEngineListBtn() {
        if (typeof browser !== 'undefined') {
            document.querySelector('#saveCfgEngineListBtn').addEventListener('click', () => {
                this.saveCfgEngineList();
            });
        } else {
            document.querySelector('#saveCfgEngineListBtn').disabled = true
        }
    }

    async saveCfgEngineList() {
        try {
            this.engineExamples = this.getCfgEngineList();

            const engineExamples = this.engineExamples;

            await browser.storage.local.set({options: {engineExamples}});
        } catch (e) {
            alert('Error. JSON is invalid.');
        }
    }

    async initCfgEngineList() {
        if (typeof browser !== 'undefined') {
            try {
                const stored = await browser.storage.local.get('options');

                if (typeof stored.options !== 'undefined') {
                    this.engineExamples = stored.options.engineExamples;
                } else {
                    await this.loadAndSaveDefaultEngineList();
                }
            } catch (e) {
                await this.loadAndSaveDefaultEngineList();
            }
        } else {
            await this.initEngineExamples();
        }
    }

    async loadAndSaveDefaultEngineList() {
        await this.initEngineExamples();
        const engineExamples = this.engineExamples;
        await browser.storage.local.set({options: {engineExamples}});
    }

    getEngineType(typeName) {
        return this.engineExamples.types.find(t => t.name === typeName);
    }

    getEngine(typeName, name) {
        const engineType = this.getEngineType(typeName);

        if (engineType !== undefined) {
            return engineType.engines.find(e => e.name === name);
        }
    }
}