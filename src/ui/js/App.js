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
        this.addEngineShortExampleBtn();
        this.initCreateEngineBtn();
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

                Util.saveData2(file, 'search.json.mozlz4');
            });
    }

    saveAsJsonBtn() {
        document.querySelector('#saveAsJsonBtn')
            .addEventListener('click', event => {
                const enginesJSONStr = this.getTxtResultField(this.codeMirror);

                Util.saveData2(enginesJSONStr, 'search.json');
            });
    }

    loadMozlz4FileBtn() {
        document.querySelector('#loadMozlz4FileBtn')
            .addEventListener('change', async event => {
                let file = event.target.files[0];
                const mozlz4Wrapper = new Mozlz4Wrapper();

                file = await mozlz4Wrapper.decode(file);

                const txt = new TextDecoder().decode(file);

                this.engines = JSON.parse(txt);
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
                this.addEngine(engineExamples.example);
            });
    }

    addEngineShortExampleBtn() {
        document.querySelector('#addEngineShortExampleBtn')
            .addEventListener('click', event => {
                this.addEngine(engineExamples.shortExample);
            });
    }

    addEngineExampleGoogleUKBtn() {
        document.querySelector('#addEngineExampleGoogleUKBtn')
            .addEventListener('click', event => {
                this.addEngine(engineExamples.googleUk);
            });
    }

    initCreateEngineBtn() {
        document.querySelector('#createEngineBtn')
            .addEventListener('click', event => {
                alert('Does not work yet!');
            });
    }

    addEngine(engine) {
        this.engines.engines.unshift(engine);
        this.setTxtResultField(this.codeMirror, this.engines);
    }

    setTxtResultField(codeMirror, engines) {
        const txt = JSON.stringify(engines, null, 4);

        codeMirror.setValue(txt);
    }

    getTxtResultField(codeMirror) {
        return codeMirror.getValue();
    }
}