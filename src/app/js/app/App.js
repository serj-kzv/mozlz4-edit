class App {
    constructor() {
        this.engineExamples = null;
        this.engines = null;
        this.codeMirror = null;
        this.tabContainer = null;

        // fields
        this.mozHeader = null;
        this.mozHeaderTxt = null;
        this.mozDecompSize = null;
        this.mozDecompSizeTxt = null;
        this.fileInfo = null;
        this.typeName = null;

        // buttons
        this.saveAsMozlz4Btn = null;
        this.saveAsJsonBtn = null;
        this.openFileBtn = null;
        this.openJSONInNewTabBtn = null;
        this.convertMozLz4ToLz4Btn = null;
        this.addEngineBtns = null;
        this.addTestEngines = null;
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

    drawSearchEngineTabs() {
        const
            src = document.querySelector('#tab-list-tmpl').textContent,
            compiled = dust.compile(src),
            tmpl = dust.loadSource(compiled);

        dust.render(tmpl, {types: this.engineExamples.types}, (err, out) => {
            this.tabContainer.innerHTML = out;
        });
    }

    async initEngineExamples() {
        const url = browser.runtime.getURL('app/resources/engines.json');

        return this.engineExamples = await (await fetch(url)).json();
    }

    initUIElements() {
        this.tabContainer = document.querySelector('#tabContainer');

        // fields
        this.mozHeader = document.querySelector('#mozHeader');
        this.mozHeaderTxt = document.querySelector('#mozHeaderTxt');
        this.mozDecompSize = document.querySelector('#mozDecompSize');
        this.mozDecompSizeTxt = document.querySelector('#mozDecompSizeTxt');
        this.fileInfo = document.querySelector('#fileInfo');
        this.typeName = document.querySelector('#typeName');

        // buttons
        this.saveAsMozlz4Btn = document.querySelector('#saveAsMozlz4Btn');
        this.saveAsJsonBtn = document.querySelector('#saveAsJsonBtn');
        this.openFileBtn = document.querySelector('#openFileBtn');
        this.openJSONInNewTabBtn = document.querySelector('#openJSONInNewTabBtn');
        this.convertMozLz4ToLz4Btn = document.querySelector('#convertMozLz4ToLz4Btn');
        this.drawSearchEngineTabs();
        this.addEngineBtns = Array.from(document.querySelectorAll('.add-engine-btn'));
        this.addTestEngines = document.querySelector('#addTestEngines');
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
        this.initConvertMozLz4ToLz4Btn();
        this.initEngineListModal();
        this.initEngineListTabs();
        this.initAddEngineBtns();
        this.initAddTestEngines();
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

    initSaveAsMozlz4Btn() {
        this.saveAsMozlz4Btn
            .addEventListener('click', async event => {
                let file = this.codeMirror.getValue();

                file = MozLz4Archiver.compress(file, new MozLz4ArchiverCommandMozLz4());
                SaveFileUtil.saveData(file, this.fileInfo.name);
            });
    }

    initSaveAsJsonBtn() {
        this.saveAsJsonBtn
            .addEventListener('click', event => {
                const enginesJSONStr = this.codeMirror.getValue();

                SaveFileUtil.saveData(enginesJSONStr, 'search.json');
            });
    }

    clrFileInfoBlock() {
        this.clearMozHeader();
        this.clearMozDecompSize();
        this.fileInfo.value = '';
        this.typeName.value = '';
    }

    initOpenFileBtn() {
        this.openFileBtn
            .addEventListener('change', async event => {
                this.setStatusLoading();
                this.clrFileInfoBlock();

                try {
                    let file = event.target.files[0];

                    const fileName = file.name;

                    file = await FileUtil.readFileAsUint8Array(file);
                    file = MozLz4Archiver.decompress(file);

                    if (file.header !== '') {
                        this.setMozHeader(file.header);
                    }

                    if (file.decompressSizeHeader !== '') {
                        this.setMozDecompSize(file.decompressSizeHeader, file.decompressSize);
                    }

                    this.fileInfo.value = fileName;
                    this.typeName.value = file.typeName;

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
                const json = this.codeMirror.getValue();

                OpenFileUtil.openAsJson(json);
            });
    }

    initConvertMozLz4ToLz4Btn() {
        this.convertMozLz4ToLz4Btn
            .addEventListener('change', async event => {
                let file = event.target.files[0];

                file = await FileUtil.readFileAsUint8Array(file);

                const result = new MozLz4Archiver().convert(file);

                SaveFileUtil.saveData(result.file, event.target.value + '.lz4');
            });
    }

    addSearchEngine(engine) {
        if (typeof this.engines.engines !== 'undefined') {
            try {
                const engineName = engine._name;

                if (this.engines.engines.map(engine => engine._name).includes(engineName)) {
                    alert(`There is already a engine with name '${engineName}'! Rename engine '${engineName}' and try again`);
                } else {
                    this.updateDataSource();
                    this.engines.engines.unshift(engine);
                    this.updateEditor();
                }
            } catch (parseEx) {
                alert('JSON is invalid!');
            }
        } else {
            alert('Engines is not defined correctly!');
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
        this.engines = JSON.parse(this.codeMirror.getValue());
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

    setMozDecompSize(decompressSizeHeader, decompressSize) {
        this.mozDecompSize.value = decompressSizeHeader;
        this.mozDecompSizeTxt.value = decompressSize;
    }

    initAddEngineBtns() {
        this.addEngineBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                const prefix = 'engine-add-';
                const postfix = `-input-${btn.dataset.engineType}-${btn.dataset.engineName}`;
                const nameInput = document.querySelector(`#${prefix}name${postfix}`);
                const urlInput = document.querySelector(`#${prefix}url${postfix}`);
                const iconInput = document.querySelector(`#${prefix}icon${postfix}`);
                const params = [];

                Array.from(document.querySelectorAll(`[id^=${prefix}params${postfix}]`))
                    .forEach(select => {
                        const value = select.options[select.selectedIndex].value;

                        if (value.length > 0) {
                            params.push(`${select.name}=${value}`);
                        }
                    });

                const engine = SearchEngineUtil.createEngine({
                    name: nameInput.value,
                    url: urlInput.value,
                    icon: iconInput.value,
                    params
                });

                this.addSearchEngine(engine);
            });
        });
    }

    initAddTestEngines() {
        this.addTestEngines.addEventListener('click', event => {
            const engines = [];

            for (let i = 0; i < 999; i++) {
                const engine = SearchEngineUtil.createEngine({
                    name: `googleTest${i}`,
                    url: `https://www.google${i}.com/search?q={searchTerms}`,
                    icon: '',
                    params: ''
                });

                engines.push(engine);
            }

            this.addSearchEngines(engines);
        });
    }
}