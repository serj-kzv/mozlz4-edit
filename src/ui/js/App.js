class App {
    constructor() {
        this.engines = null;
        this.codeMirror = null;
        this.FileUtil = null;

        // fields
        this.mozHeader = null;
        this.mozHeaderTxt = null;
        this.mozDecompSize = null;
        this.mozDecompSizeTxt = null;

        // buttons
        this.saveAsMozlz4Btn = null;
        this.saveAsJsonBtn = null;
        this.loadMozlz4FileBtn = null;
        this.loadJSONFileBtn = null;
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
            this.initFileUtil(SaveTypeEnum.WITH_API);
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

        // buttons
        this.saveAsMozlz4Btn = document.querySelector('#saveAsMozlz4Btn');
        this.saveAsJsonBtn = document.querySelector('#saveAsJsonBtn');
        this.loadMozlz4FileBtn = document.querySelector('#loadMozlz4FileBtn');
        this.loadJSONFileBtn = document.querySelector('#loadJSONFileBtn');
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

    initFileUtil(saveType) {
        switch (true) {
            case saveType === SaveTypeEnum.WITH_LINK: {
                this.FileUtil = SaveWithLinkFileUtil;
                break;
            }
            case saveType === SaveTypeEnum.WITH_TAB: {
                this.FileUtil = SaveWithTabFileUtil;
                break;
            }
            case saveType === SaveTypeEnum.WITH_API: {
                this.FileUtil = SaveWithAPIFileUtil;
                break;
            }
        }
    }

    initListeners() {
        this.initEngines();
        this.initEditor();
        this.initSaveAsMozlz4Btn();
        this.initSaveAsJsonBtn();
        this.initLoadMozlz4FileBtn();
        this.initLoadJSONFileBtn();
        this.initOpenJSONInNewTabBtn();
        this.initAddEngineExampleBtn();
        this.initAddEngineShortExampleBtn();
        this.initAddEngineExampleGoogleUKBtn();
        this.initConvertMozLz4ToLz4Btn();
        this.initSaveTypeRadio();
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

    initSaveTypeRadio() {
        const radios = Array.from(document.querySelectorAll('input[type="radio"][name="saveType"]'));

        radios.forEach(radio => {
            radio.addEventListener('change', event => {
                let saveType = Array.from(radios).find(radio => radio.checked).value;

                saveType = SaveTypeEnum[`${saveType}`];
                this.initFileUtil(saveType);
            });
        });

        // set first radio as default
        radios[0].checked = true;
    }

    initSaveAsMozlz4Btn() {
        this.saveAsMozlz4Btn
            .addEventListener('click', async event => {
                const enginesStr = this.getTxtResultField(this.codeMirror);
                const file = new Mozlz4Wrapper().encodeMozLz4(enginesStr);

                this.FileUtil.saveData(file, 'search.json.mozlz4');
            });
    }

    initSaveAsJsonBtn() {
        this.saveAsJsonBtn
            .addEventListener('click', event => {
                const enginesJSONStr = this.getTxtResultField(this.codeMirror);

                this.FileUtil.saveData(enginesJSONStr, 'search.json');
            });
    }

    initLoadMozlz4FileBtn() {
        this.loadMozlz4FileBtn
            .addEventListener('change', async event => {
                let file = event.target.files[0];

                file = await this.FileUtil.readFileAsUint8Array(file);

                const result = new Mozlz4Wrapper().decodeMozLz4(file);

                file = new TextDecoder().decode(result.file);
                try {
                    this.engines = JSON.parse(file);
                    this.setTxtResultField(this.codeMirror, this.engines);
                } catch (jsonParseEx) {
                    this.setTxtResultFieldTxt(this.codeMirror, file);
                }
                this.setMozHeader(result.mozHeader);
                this.setMozDecompSize(result.decompSize);
            });
    }

    initLoadJSONFileBtn() {
        const that = this;

        this.loadJSONFileBtn
            .addEventListener('change', async event => {
                let file = event.target.files[0];

                file = await this.FileUtil.readFileAsTxt(file);
                try {
                    this.engines = JSON.parse(file);
                    this.setTxtResultField(this.codeMirror, this.engines);
                } catch (jsonParseEx) {
                    this.setTxtResultFieldTxt(this.codeMirror, file);
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

                const result = new Mozlz4Wrapper().convertMozLz4ToLz4(file);

                this.FileUtil.saveData(result.file, event.target.value + '.lz4');
            });
    }

    addSearchEngine(engine) {
        if (Util.isDefinedVar(this.engines.engines)) {
            this.engines.engines.unshift(engine);
            this.setTxtResultField(this.codeMirror, this.engines);
        }
    }

    setTxtResultField(codeMirror, engines) {
        const txt = JSON.stringify(engines, null, 4);

        codeMirror.setValue(txt);
    }

    setTxtResultFieldTxt(codeMirror, txt) {
        codeMirror.setValue(txt);
    }

    setMozHeader(header) {
        this.mozHeader.value = header;
        this.mozHeaderTxt.value = new TextDecoder().decode(header);
    }

    setMozDecompSize(decompSize) {
        this.mozDecompSize.value = decompSize;
        this.mozDecompSizeTxt.value = new TextDecoder().decode(decompSize);
    }

    getTxtResultField(codeMirror) {
        return codeMirror.getValue();
    }
}