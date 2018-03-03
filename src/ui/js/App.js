class App {
    constructor() {
        this.engines = {
            engines: []
        };
    }

    run() {
        this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        document.addEventListener("DOMContentLoaded", event => {
            this.initListeners();
        });
    }

    initListeners() {
        this.saveAsMozlz4Btn();
        this.saveAsJsonBtn();
        this.loadMozlz4FileBtn();
        this.loadJSONFileBtn();
        this.openJSONInNewTabBtn();
        this.addEngineExampleBtn();
        this.addEngineExampleGoogleUKBtn();
    }

    saveAsMozlz4Btn() {
        document.querySelector('#saveAsMozlz4Btn')
            .addEventListener('click', function (event) {
                const enginesStr = App.getTxtResultField();

                new Mozlz4Wrapper().encode(enginesStr).then(file => {
                    Util.saveData2(file, 'search.json.mozlz4');
                });
            });
    }

    saveAsJsonBtn() {
        document.querySelector('#saveAsJsonBtn')
            .addEventListener('click', event => {
                const enginesJSONStr = App.getTxtResultField();

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

                console.log(this.engines);

                App.setTxtResultField(this.engines);
            });
    }

    loadJSONFileBtn() {
        const that = this;

        document.querySelector('#loadJSONFileBtn')
            .addEventListener('change', event => {
                let file = event.target.files[0];
                const txt = Util.readFileAsTxt(file).then(txt => {
                    that.engines = JSON.parse(txt);
                    App.setTxtResultField(that.engines);
                });
            });
    }

    openJSONInNewTabBtn() {
        document.querySelector('#openJSONInNewTabBtn')
            .addEventListener('click', event => {
                const json = App.getTxtResultField();

                Util.openAsJson(json);
            });
    }

    addEngineExampleBtn() {
        document.querySelector('#addEngineExampleBtn')
            .addEventListener('click', event => {
                this.engines.engines.unshift(engineExample);
                App.setTxtResultField(this.engines)
            });
    }

    addEngineExampleGoogleUKBtn() {
        document.querySelector('#addEngineExampleGoogleUKBtn')
            .addEventListener('click', event => {
                this.engines.engines.unshift(engineExampleGoogleUK);
                App.setTxtResultField(this.engines)
            });
    }

    static setTxtResultField(engines) {
        const txt = JSON.stringify(engines, null, 4);

        document.querySelector('#txtResult').value = txt;
    }

    static getTxtResultField() {
        return document.querySelector('#txtResult').value;
    }
}