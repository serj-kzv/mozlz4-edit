import FileUtil from '../../lib/app/fileUtil/FileUtil.js';
import IconUtil from '../../lib/app/IconUtil.js';
import ModalPlugin from '../../lib/app/modal/ModalPlugin.js';
import SearchEngineUtil from '../../lib/app/SearchEngineUtil.js';
import TabPlugin from '../../lib/app/tab/TabPlugin.js';
import WEB_EXT_API from '../../lib/app/WebExtApi.js';

export default class AppAddEngine {
    constructor(appCfg) {
        this.appCfg = appCfg;
        this.addEngineBtns = null;
        this.addTestEngines = null;
        this.openIconBtns = null;
        this.clrIconBtns = null;
        this.tabContainer = null;
        this.addEngineTmpl = null;
    }

    static async build() {
        const appAddEngine = new AppAddEngine();

        await appAddEngine.init();

        return appAddEngine;
    }

    async init() {
        await this.initSearchEngineTabs();
        this.updateSearchEngineIcons();
        this.tabContainer = document.querySelector('#tabContainer');
        this.initEngineListModal();
    }

    async initSearchEngineTabs() {
        const url = WEB_EXT_API.getURL('app/addEngine.htm');
        const tmplTxt = await (await fetch(url)).text();

        const
            src = tmplTxt,
            compiled = dust.compile(src);

        this.addEngineTmpl = dust.loadSource(compiled);
    }

    initAddEngine() {
        new TabPlugin('#tabContainer');
        this.addEngineBtns = Array.from(document.querySelectorAll('.add-engine-btn'));
        this.addTestEngines = document.querySelector('#addTestEngines');
        this.openIconBtns = Array.from(document.querySelectorAll('input[type="file"].engine-add-icon-btn'));
        this.clrIconBtns = Array.from(document.querySelectorAll('button.engine-clr-icon-btn'));

        this.initAddEngineBtns();
        this.initAddTestEngines();
        this.initOpenIconBtns();
        this.initClrIconBtns();
        this.initImgInputAndImgSync();
        this.initChangeParamsUrlUpd();
        this.initMultiJsSelects();
        this.initTxtToEngineIcon();
    }

    initTxtToEngineIcon() {
        Array.from(document.querySelectorAll('.engine-icon-txt'))
            .forEach(input => input.addEventListener('input', async event => {
                const that = event.target;
                const value = that.value;
                const engineBlock = that.closest('.engine-add-block');
                const iconInput = engineBlock.querySelector('input[id^="engine-add-icon-input-"]');

                if (value.length > 0) {
                    iconInput.value = await FileUtil.readFileAsBase64(new Blob(
                        [IconUtil.txtToSvg(value, 23, 23)],
                        {type: 'image/svg+xml'}
                    ));

                    const img = engineBlock.querySelector('img[id^="engine-add-icon-input-"]');

                    this.updateSearchEngineIcon(iconInput, img, null);
                } else {
                    const img = engineBlock.querySelector('img[id^="engine-add-icon-input-"]');
                    this.updateSearchEngineIcon(iconInput, img, '');
                }
            }));
    }

    initMultiJsSelects() {
        Array.from(document.querySelectorAll('select.engine-add-params-input-select[multiple]'))
            .forEach(select => multi(select));
    }

    initChangeParamsUrlUpd() {
        const selector = '[id^="engine-add-params-input-"]';

        Array.from(document.querySelectorAll(selector)).forEach(select => select.addEventListener('change', event => {
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

    initImgInputAndImgSync() {
        document.body.addEventListener('input', event => {
            const that = event.target;

            if (that.matches('input[id^="engine-add-icon-input-"]')) {
                document.querySelector(`img[id="${that.id}-img"]`).src = that.value;
            }
        });
    }

    initClrIconBtns() {
        this.clrIconBtns.forEach(clrIconBtn => clrIconBtn.addEventListener('click', async event => {
            const targetId = event.target.dataset.targetId;

            document.querySelector(`input[id="${targetId}"]`).value = '';
            document.querySelector(`img[id="${targetId}-img"]`).src = '';
        }));
    }

    initEngineListModal() {
        new ModalPlugin('addEngineBtn', 'addEngineModal', {
            onOpen: () => {
                dust.render(
                    this.addEngineTmpl,
                    {types: this.appCfg.getEngines().types}, (err, out) => this.tabContainer.innerHTML = out);
                this.initAddEngine();
            },
            onClose: () => this.tabContainer.innerHTML = ''
        });
    }

    initAddEngineBtns() {
        this.addEngineBtns.forEach(btn => btn.addEventListener('click', event => {
            const prefix = 'engine-add-';
            const postfix = `-input-${btn.dataset.engineType}-${btn.dataset.engineName}`;
            const nameInput = document.querySelector(`[id="${prefix}name${postfix}"]`);
            const urlInput = document.querySelector(`[id="${prefix}url${postfix}"]`);
            const iconInput = document.querySelector(`[id="${prefix}icon${postfix}"]`);
            const engine = SearchEngineUtil.createEngine({
                name: nameInput == null ? '' : nameInput.value,
                url: urlInput == null ? '' : urlInput.value,
                icon: iconInput == null ? '' : iconInput.value
            });

            this.addSearchEngine(engine);
        }));
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

        imgs.forEach((img, index) => this.updateSearchEngineIcon(inputs[index], img, null));
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
                value: isMulti ? Array.from(options).reduce((filtered, opt) => {
                    if (opt.selected) {
                        filtered.push(opt.value);
                    }

                    return filtered;
                }, []) : options[param.selectedIndex].value,
                divider: dataset.multiDivider
            };
        });
    }
}