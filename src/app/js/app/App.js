class App {
    constructor() {
        this.engineExamples = null;
        this.engines = null;
        this.codeMirror = null;
        this.FileUtil = SaveWithAPIFileUtil;

        // fields
        this.mozHeader = null;
        this.mozHeaderTxt = null;
        this.mozDecompSize = null;
        this.mozDecompSizeTxt = null;
        this.fileInfo = null;

        // buttons
        this.saveAsMozlz4Btn = null;
        this.saveAsJsonBtn = null;
        this.openFileBtn = null;
        this.openJSONInNewTabBtn = null;
        this.addEngineExampleBtn = null;
        this.addEngineShortExampleBtn = null;
        this.addEngineExampleGoogleUKBtn = null;
        this.convertMozLz4ToLz4Btn = null;
        this.addEngineTestBtn = null;
    }

    async run() {
        this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        document.addEventListener("DOMContentLoaded", async event => {
            await this.initEngineExamples();
            this.initUIElements();
            this.initListeners();
        });
    }

    async initEngineExamples() {
        const url = browser.runtime.getURL('app/resources/engines.json');

        return this.engineExamples = await (await fetch(url)).json();
    }

    initUIElements() {
        // fields
        this.mozHeader = document.querySelector('#mozHeader');
        this.mozHeaderTxt = document.querySelector('#mozHeaderTxt');
        this.mozDecompSize = document.querySelector('#mozDecompSize');
        this.mozDecompSizeTxt = document.querySelector('#mozDecompSizeTxt');
        this.fileInfo = document.querySelector('#fileInfo');

        // buttons
        this.saveAsMozlz4Btn = document.querySelector('#saveAsMozlz4Btn');
        this.saveAsJsonBtn = document.querySelector('#saveAsJsonBtn');
        this.openFileBtn = document.querySelector('#openFileBtn');
        this.openJSONInNewTabBtn = document.querySelector('#openJSONInNewTabBtn');
        this.addEngineExampleBtn = document.querySelector('#addEngineExampleBtn');
        this.addEngineShortExampleBtn = document.querySelector('#addEngineShortExampleBtn');
        this.addEngineExampleGoogleUKBtn = document.querySelector('#addEngineExampleGoogleUKBtn');
        this.convertMozLz4ToLz4Btn = document.querySelector('#convertMozLz4ToLz4Btn');
        this.addEngineTestBtn = document.querySelector('#addEngineTestBtn');
    }

    initEngines() {
        this.engines = {
            engines: []
        };
    }

    initListeners() {
        this.initEngines();
        this.initEditor();
        this.initSaveAsMozlz4Btn();
        this.initSaveAsJsonBtn();
        this.initOpenFileBtn();
        this.initOpenJSONInNewTabBtn();
        this.initAddEngineExampleBtn();
        this.initAddEngineShortExampleBtn();
        this.initAddEngineExampleGoogleUKBtn();
        this.initConvertMozLz4ToLz4Btn();
        this.initAddEngineTestBtn();
        this.initEngineListModal();
        this.initEngineListTabs();
    }

    initEngineListModal() {
        new ModalPlugin('myBtn', 'myModal');
    }

    initEngineListTabs() {
        new TabPlugin('#tabContainer');
    }

    initEditor() {
        const txtResult = document.querySelector('#txtResult');

        this.codeMirror = CodeMirror.fromTextArea(txtResult, {
            mode: "javascript",
            theme: "liquibyte",
            lineNumbers: true,
            viewportMargin: Infinity,
            maxHighlightLength: Infinity,
            styleActiveLine: true,
            matchBrackets: true
        });
    }

    initAddEngineTestBtn() {
        this.addEngineTestBtn
            .addEventListener('click', event => {
                const engines = [];

                for (let i = 0; i < 999; i++) {
                    const engine = Object.assign({}, this.engineExamples.googleUk);

                    engine._name = `GoogleTest${i}`;
                    engine._loadPath = `[other]/GoogleTest${i}.xml`;
                    engine._urls[0].template = 'https://www.google' + i + '.test/search?q={searchTerms}';
                    engines.push(engine);
                }
                this.addSearchEngines(engines);
            });
    }

    initSaveAsMozlz4Btn() {
        this.saveAsMozlz4Btn
            .addEventListener('click', async event => {
                let file = this.getTxtResultField(this.codeMirror);

                file = MozLz4Archiver.compress(file, new MozLz4ArchiverCommandMozLz4());

                this.FileUtil.saveData(file, this.getFileInfo().name);
            });
    }

    initSaveAsJsonBtn() {
        this.saveAsJsonBtn
            .addEventListener('click', event => {
                const enginesJSONStr = this.getTxtResultField(this.codeMirror);

                this.FileUtil.saveData(enginesJSONStr, 'search.json');
            });
    }

    initOpenFileBtn() {
        this.openFileBtn
            .addEventListener('change', async event => {
                this.setStatusLoading();
                this.clearMozHeader();
                this.clearMozDecompSize();

                try {
                    let file = event.target.files[0];

                    this.setFileInfo(file);

                    file = await this.FileUtil.readFileAsUint8Array(file);
                    file = MozLz4Archiver.decompress(file);

                    if (file.header !== '') {
                        this.setMozHeader(file.header);
                    }

                    if (file.decompressSize !== '') {
                        this.setMozDecompSize(file.decompressSize);
                    }

                    const fileTxt = new TextDecoder().decode(file.file);

                    try {
                        this.engines = JSON.parse(fileTxt);
                        this.setTxtResultField(this.codeMirror, this.engines);
                    } catch (jsonParseEx) {
                        this.setTxtResultFieldTxt(this.codeMirror, fileTxt);
                    }
                } catch (e) {
                    console.error(e);
                    this.setStatusFail();
                }
            });
    }

    initOpenJSONInNewTabBtn() {
        this.openJSONInNewTabBtn
            .addEventListener('click', event => {
                const json = this.getTxtResultField(this.codeMirror);

                this.FileUtil.openAsJson(json);
            });
    }

    initAddEngineShortExampleBtn() {
        this.addEngineShortExampleBtn
            .addEventListener('click', event => {
                this.addSearchEngine(this.engineExamples.shortExample);
            });
    }

    initAddEngineExampleBtn() {
        this.addEngineExampleBtn
            .addEventListener('click', event => {
                this.addSearchEngine(this.engineExamples.example);
            });
    }

    initAddEngineExampleGoogleUKBtn() {
        this.addEngineExampleGoogleUKBtn
            .addEventListener('click', event => {
                this.addSearchEngine(this.engineExamples.googleUk);
            });
    }

    initConvertMozLz4ToLz4Btn() {
        this.convertMozLz4ToLz4Btn
            .addEventListener('change', async event => {
                let file = event.target.files[0];

                file = await this.FileUtil.readFileAsUint8Array(file);

                const result = new MozLz4Archiver().convert(file);

                this.FileUtil.saveData(result.file, event.target.value + '.lz4');
            });
    }

    addSearchEngine(engine) {
        if (typeof this.engines.engines !== 'undefined') {
            try {
                this.updateDataSource();
                this.engines.engines.unshift(engine);
                this.updateEditor();
            } catch (parseEx) {
                alert('JSON is invalid!');
            }
        } else {
            alert('Engines is not defined correctly!')
        }
    }

    addSearchEngines(engines) {
        if (typeof this.engines.engines !== 'undefined') {
            try {
                this.updateDataSource();
                this.engines.engines.unshift(...engines);
                this.updateEditor();
            } catch (parseEx) {
                alert('JSON is invalid!');
            }
        } else {
            alert('Engines is not defined correctly!')
        }
    }

    updateDataSource() {
        this.engines = JSON.parse(this.getTxtResultField(this.codeMirror));
    }

    updateEditor() {
        this.setTxtResultField(this.codeMirror, this.engines);
    }

    setTxtResultField(codeMirror, engines) {
        const txt = JSON.stringify(engines, null, 4);

        codeMirror.setValue(txt);
    }

    setTxtResultFieldTxt(codeMirror, txt) {
        codeMirror.setValue(txt);
    }

    setStatusLoading() {
        this.setTxtResultField(this.codeMirror, 'Loading... Wait.');
    }

    setStatusFail() {
        this.setTxtResultField(this.codeMirror, 'Fail! Try again.');
    }

    setFileInfo(file) {
        this.fileInfo.value = file.name;
    }

    getFileInfo() {
        return {
            name: this.fileInfo.value
        };
    }

    setMozHeader(val) {
        this.mozHeader.value = val;
        this.mozHeaderTxt.value = new TextDecoder().decode(val);
    }

    clearMozHeader() {
        this.mozHeader.value = '';
        this.mozHeaderTxt.value = '';
    }

    clearMozDecompSize() {
        this.mozDecompSize.value = '';
        this.mozDecompSizeTxt.value = '';
    }

    setMozDecompSize(val) {
        this.mozDecompSize.value = val;
        // this.mozDecompSizeTxt.value = new Uint32Array(val);
        this.mozDecompSizeTxt.value = val.reduce((accumulator, currentValue) => accumulator + new Uint8Array([currentValue]));

        this.mozDecompSizeTxt.value = MozLz4Archiver.uInt8sToUInt32s(val);
        MozLz4Archiver.uInt32sToUInt8s(34619);

        // this.mozDecompSizeTxt.value = val.reduce((accumulator, currentValue) => accumulator * ++currentValue);
    }

    getTxtResultField(codeMirror) {
        return codeMirror.getValue();
    }
}