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
        this.openIconBtns = null;
        this.clrIconBtns = null;
    }

    async run() {
        this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        document.addEventListener("DOMContentLoaded", async event => {
            await this.initEngineExamples();
            await this.initUIElements();
            this.initListeners();
        });
    }

    async drawSearchEngineTabs() {
        const url = browser.runtime.getURL('app/addEngine.htm');
        const tmplTxt = await (await fetch(url)).text();

        const
            src = tmplTxt,
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

    async initUIElements() {
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
        await this.drawSearchEngineTabs();
        this.addEngineBtns = Array.from(document.querySelectorAll('.add-engine-btn'));
        this.addTestEngines = document.querySelector('#addTestEngines');
        this.openIconBtns = Array.from(document.querySelectorAll('input[type="file"].engine-add-icon-btn'));
        this.clrIconBtns = Array.from(document.querySelectorAll('button.engine-clr-icon-btn'));
        this.updateSearchEngineIcons();

        TrimHtmlWhiteSpace.trim(document.body);
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
        this.initOpenIconBtns();
        this.initClrIconBtns();
        this.initImgInputAndImgSync();
        this.initChangeParamsUrlUpd();
    }

    initEngineListModal() {
        new ModalPlugin('addEngineBtn', 'addEngineModal');
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
                const fileName = this.fileInfo.value;

                file = MozLz4Archiver.compress(file, new MozLz4ArchiverCommandMozLz4());

                try {
                    await SaveFileUtil.saveData(file, fileName);
                } catch (e) {
                    alert(`An error! Possibly the file '${fileName}' is busy. Close programs that can use the file and try again.`);
                }
            });
    }

    initSaveAsJsonBtn() {
        this.saveAsJsonBtn
            .addEventListener('click', async event => {
                const
                    enginesJSONStr = this.codeMirror.getValue(),
                    fileName = `${this.fileInfo.value}.json`;

                try {
                    await SaveFileUtil.saveData(enginesJSONStr, fileName);
                } catch (e) {
                    alert(`An error! Possibly the file '${fileName}' is busy. Close programs that can use the file and try again.`);
                }
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

                try {
                    await SaveFileUtil.saveData(result.file, event.target.value + '.lz4');
                } catch (e) {
                    alert(`An error! Possibly the file is busy. Close programs that can use the file and try again.`);
                }
            });
    }

    addSearchEngine(engine) {
        if (typeof this.engines.engines !== 'undefined') {
            try {
                this.updateDataSource();

                const engineName = engine._name;

                if (this.engines.engines.map(engine => engine._name).includes(engineName)) {
                    alert(`There is already a engine with the name '${engineName}'! Rename the engine '${engineName}' and try again.`);
                } else {
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

                const
                    engineNames = this.engines.engines.map(engine => engine._name),
                    existedEngineNames = engines
                        .map(engine => {
                            const name = engine._name;

                            return engineNames.includes(name) ? name : null;
                        })
                        .filter(engine => engine !== null);

                if (existedEngineNames.length > 0) {
                    const msg = `There are already a engine with names "${existedEngineNames.join('", "')}"!`;

                    alert(msg);
                } else {
                    this.engines.engines.unshift(...engines);
                    this.updateEditor();
                }
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
                const nameInput = document.querySelector(`[id="${prefix}name${postfix}"]`);
                const urlInput = document.querySelector(`[id="${prefix}url${postfix}"]`);
                const iconInput = document.querySelector(`[id="${prefix}icon${postfix}"]`);
                const paramSelects = Array.from(document.querySelectorAll(`[id^="${prefix}params${postfix}"]`));
                const engine = SearchEngineUtil.createEngine({
                    name: nameInput == null ? '' : nameInput.value,
                    url: urlInput == null ? '' : urlInput.value,
                    icon: iconInput == null ? '' : iconInput.value,
                    // params: App.collectEngineParams(paramSelects)
                });

                this.addSearchEngine(engine);
            });
        });
    }

    initChangeParamsUrlUpd() {
        const selector = '[id^="engine-add-params-input-"]';

        Array.from(document.querySelectorAll(selector))
            .forEach(select => select.addEventListener('change', event => {
                const engineAddBlock = event.target.closest('.engine-add-block');
                let engineParams = App.collectEngineParams(Array.from(engineAddBlock.querySelectorAll(selector)));

                engineParams = SearchEngineUtil.engineParamsToUrlParams(engineParams).map(p => p.urlParam);
                engineParams = engineParams.length === 0 ? '' : `&${engineParams.join('&')}`;

                const
                    dataset = engineAddBlock.dataset,
                    urlInput = engineAddBlock.querySelector('input.engine-url');

                urlInput.value = `${this.getEngine(dataset.engineTypeName, dataset.engineName).url}${engineParams}`;
            }));
    }

    getEngine(typeName, name) {
        const engineType = this.getEngineType(typeName);

        if (engineType !== undefined) {
            return engineType.engines.find(e => e.name === name);
        }
    }

    getEngineType(typeName) {
        return this.engineExamples.types.find(t => t.name === typeName);
    }

    static collectEngineParams(paramSelects) {
        return paramSelects.map(param => {
            const
                isMulti = param.multiple,
                dataset = param.dataset,
                options = param.options;

            return {
                name: param.name,
                multi: isMulti,
                multiType: dataset.multiOr ? 'or' : dataset.multiAnd ? 'and' : undefined,
                value: isMulti ? Array.from(options)
                    .reduce((filtered, opt) => {
                        if (opt.selected) {
                            filtered.push(opt.value);
                        }

                        return filtered;
                    }, []) : options[param.selectedIndex].value,
                divider: dataset.multiDivider
            };
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

    initOpenIconBtns() {
        this.openIconBtns.forEach(openIconBtn => openIconBtn.addEventListener('change', async event => {
            const btn = event.target;
            const file = btn.files[0];
            const targetId = btn.dataset.targetId;
            const input = document.querySelector(`input[id="${targetId}"]`);
            const img = document.querySelector(`img[id="${targetId}-img"]`);
            const base64 = await FileUtil.readFileAsBase64(file);

            this.updateSearchEngineIcon(input, img, base64);
        }));
    }

    updateSearchEngineIcon(input, img, base64) {
        if (base64 != null) {
            input.value = base64;
        }

        img.src = input.value;
    }

    updateSearchEngineIcons() {
        const imgs = document.querySelectorAll('img[id^="engine-add-icon-input-"]');
        const inputs = document.querySelectorAll('input[id^="engine-add-icon-input-"]');

        imgs.forEach((img, index) => {
            this.updateSearchEngineIcon(inputs[index], img, null);
        });
    }

    initClrIconBtns() {
        this.clrIconBtns.forEach(clrIconBtn => clrIconBtn.addEventListener('click', async event => {
            const targetId = event.target.dataset.targetId;

            document.querySelector(`input[id="${targetId}"]`).value = '';
            document.querySelector(`img[id="${targetId}-img"]`).src = '';
        }));
    }

    initImgInputAndImgSync() {
        document.body.addEventListener('input', event => {
            const that = event.target;

            if (that.matches('input[id^="engine-add-icon-input-"]')) {
                document.querySelector(`img[id="${that.id}-img"]`).src = that.value;
            }
        });
    }
}