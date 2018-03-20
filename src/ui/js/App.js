class App {
    constructor() {
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
    }

    run() {
        this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        document.addEventListener("DOMContentLoaded", event => {
            this.initUIElements();
            this.initListeners();
        });
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

                    console.log(file)

                    this.setFileInfo(file);

                    file = await this.FileUtil.readFileAsUint8Array(file);
                    file = MozLz4Archiver.decompress(file);

                    if (file.header !== '') {
                        this.setMozHeader(file.header);
                        this.setMozDecompSize(file.decompressSize);
                    }

                    const fileTxt = new TextDecoder().decode(file.file);

                    console.log(fileTxt.length)

                    try {
                        this.engines = JSON.parse(fileTxt);
                        this.setTxtResultField(this.codeMirror, this.engines);
                    } catch (jsonParseEx) {
                        this.setTxtResultFieldTxt(this.codeMirror, fileTxt);
                    }
                } catch (e) {
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
                this.addSearchEngine(engineExamples.shortExample);
            });
    }

    initAddEngineExampleBtn() {
        this.addEngineExampleBtn
            .addEventListener('click', event => {
                this.addSearchEngine(engineExamples.example);
            });
    }

    initAddEngineExampleGoogleUKBtn() {
        this.addEngineExampleGoogleUKBtn
            .addEventListener('click', event => {
                this.addSearchEngine(engineExamples.googleUk);
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
        if (Util.isDefinedVar(this.engines.engines)) {
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
        this.mozDecompSizeTxt.value = val.reduce((accumulator, currentValue) => accumulator * ++currentValue);
    }

    getTxtResultField(codeMirror) {
        return codeMirror.getValue();
    }
}