export default class TabPlugin {
    constructor(tabContainerSelector) {
        this.activePair = null;
        this.CFG = TabPlugin.getCfg();
        this.init(tabContainerSelector);
    }

    init(tabContainerSelector) {
        const pairs = this.initPairs(tabContainerSelector);

        this.setDefaultPair(pairs);
    }

    initPairs(tabContainerSelector) {
        return Array.from(document.querySelectorAll(`${tabContainerSelector} .${this.CFG.tabClass}`))
            .map(tab => {
                const pair = {
                    tab,
                    tabContent: document.querySelector(`#${tab.dataset.targetTabContentId}`)
                };

                tab.addEventListener('click', event => this.show(pair));

                return pair;
            });
    }

    setDefaultPair(pairs) {
        const defaultPair = pairs.find(pair => pair.tab.classList.contains(`${this.CFG.defaultTabClass}`));

        this.show(defaultPair);
    }

    show(pair) {
        if (this.activePair !== pair) {
            if (this.activePair != null) {
                this.activePair.tab.classList.remove(`${this.CFG.tabShownClass}`);
                this.activePair.tabContent.classList.remove(`${this.CFG.tabContentShownClass}`);
            }
            this.activePair = pair;
            this.activePair.tab.classList.add(`${this.CFG.tabShownClass}`);
            this.activePair.tabContent.classList.add(`${this.CFG.tabContentShownClass}`);
        }
    }

    static getCfg() {
        return Object.freeze({
            tabClass: 'TabPlugin-tab',
            tabShownClass: 'TabPlugin-tab-shown',
            defaultTabClass: 'TabPlugin-tab-default',
            tabContentShownClass: 'TabPlugin-tab-content-shown',
            dataTargetTabContentId: 'is empty yet'
        });
    }
}