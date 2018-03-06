class App {
    constructor() {
        this.engines = null;
        this.codeMirror = null;
    }

    run() {
        this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        document.addEventListener("DOMContentLoaded", event => {
            this.initListeners();
        });
    }

    initEngines() {
        this.engines = {
            engines: []
        };
    }

    initListeners() {
        this.initEngines();
        this.initEditor();
        this.saveAsMozlz4Btn();
        this.saveAsJsonBtn();
        this.loadMozlz4FileBtn();
        this.loadJSONFileBtn();
        this.openJSONInNewTabBtn();
        this.addEngineExampleBtn();
        this.addEngineExampleGoogleUKBtn();
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

    saveAsMozlz4Btn() {
        document.querySelector('#saveAsMozlz4Btn')
            .addEventListener('click', async event => {
                const enginesStr = this.getTxtResultField(this.codeMirror);
                const file = new Mozlz4Wrapper().encodeMozLz4(enginesStr);

                Util.saveData(file, 'search.json.mozlz4');
            });
    }

    saveAsJsonBtn() {
        document.querySelector('#saveAsJsonBtn')
            .addEventListener('click', event => {
                const enginesJSONStr = this.getTxtResultField(this.codeMirror);

                Util.saveData(enginesJSONStr, 'search.json');
            });
    }

    loadMozlz4FileBtn() {
        document.querySelector('#loadMozlz4FileBtn')
            .addEventListener('change', async event => {
                let file = event.target.files[0];

                file = await Util.readFileAsUint8Array(file);

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

    loadJSONFileBtn() {
        const that = this;

        document.querySelector('#loadJSONFileBtn')
            .addEventListener('change', async event => {
                let file = event.target.files[0];

                file = await Util.readFileAsTxt(file);
                try {
                    this.engines = JSON.parse(file);
                    this.setTxtResultField(this.codeMirror, this.engines);
                } catch (jsonParseEx) {
                    this.setTxtResultFieldTxt(this.codeMirror, file);
                }
            });
    }

    openJSONInNewTabBtn() {
        document.querySelector('#openJSONInNewTabBtn')
            .addEventListener('click', event => {
                const json = this.getTxtResultField(this.codeMirror);

                Util.openAsJson(json);
            });
    }

    addEngineExampleBtn() {
        document.querySelector('#addEngineExampleBtn')
            .addEventListener('click', event => {
                this.addSearchEngine(engineExamples.example);
            });
    }

    addEngineExampleGoogleUKBtn() {
        document.querySelector('#addEngineExampleGoogleUKBtn')
            .addEventListener('click', event => {
                this.addSearchEngine(engineExamples.googleUk);
            });
    }

    initConvertMozLz4ToLz4Btn() {
        document.querySelector('#convertMozLz4ToLz4Btn')
            .addEventListener('change', async event => {
                let file = event.target.files[0];

                file = await Util.readFileAsUint8Array(file);

                const result = new Mozlz4Wrapper().convertMozLz4ToLz4(file);

                console.log(result.file);
                console.log(result.file);

                Util.saveData(result.file, event.target.value + '.lz4');
                // Util.saveAsDataWithLink(result.file, 'application/octet-stream', false, event.target.value + '.lz4');
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
        document.querySelector('#mozHeader').value = header;
        document.querySelector('#mozHeaderTxt').value = new TextDecoder().decode(header);
    }

    setMozDecompSize(decompSize) {
        document.querySelector('#mozDecompSize').value = decompSize;
        document.querySelector('#mozDecompSizeTxt').value = new TextDecoder().decode(decompSize);
    }

    getTxtResultField(codeMirror) {
        return codeMirror.getValue();
    }
}