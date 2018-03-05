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
                const file = await new Mozlz4Wrapper().encode(enginesStr);

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

                file = await Util.readUint8ArrayOfFile(file);
                file = new Mozlz4Wrapper().decode(file);
                file = new TextDecoder().decode(file);

                this.engines = JSON.parse(file);
                this.setTxtResultField(this.codeMirror, this.engines);
            });
    }

    loadJSONFileBtn() {
        const that = this;

        document.querySelector('#loadJSONFileBtn')
            .addEventListener('change', async event => {
                let file = event.target.files[0];
                const txt = await Util.readFileAsTxt(file);

                that.engines = JSON.parse(txt);
                this.setTxtResultField(this.codeMirror, that.engines);
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
                this.engines.engines.unshift(engineExamples.example);
                this.setTxtResultField(this.codeMirror, this.engines);
            });
    }

    addEngineExampleGoogleUKBtn() {
        document.querySelector('#addEngineExampleGoogleUKBtn')
            .addEventListener('click', event => {
                this.engines.engines.unshift(engineExamples.googleUk);
                this.setTxtResultField(this.codeMirror, this.engines);
            });
    }

    setTxtResultField(codeMirror, engines) {
        const txt = JSON.stringify(engines, null, 4);

        codeMirror.setValue(txt);
    }

    getTxtResultField(codeMirror) {
        return codeMirror.getValue();
    }
}