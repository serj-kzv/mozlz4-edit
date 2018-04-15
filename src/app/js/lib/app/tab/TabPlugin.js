class TabPlugin {
    constructor(tabContainerSelector) {
        this.activePair = null;
        this.init(tabContainerSelector);
    }

    init(tabContainerSelector) {
        const pairs = this.initPairs(tabContainerSelector);

        this.setDefaultPair(pairs);
    }

    initPairs(tabContainerSelector) {
        return Array.from(document.querySelectorAll(`${tabContainerSelector} .${TabPlugin.getConf().tabClass}`))
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
        const defaultPair = pairs.find(pair => pair.tab.classList.contains(`${TabPlugin.getConf().defaultTabClass}`));

        this.show(defaultPair);
    }

    show(pair) {
        if (this.activePair !== pair) {
            if (this.activePair != null) {
                this.activePair.tab.classList.remove(`${TabPlugin.getConf().tabShownClass}`);
                this.activePair.tabContent.classList.remove(`${TabPlugin.getConf().tabContentShownClass}`);
            }
            this.activePair = pair;
            this.activePair.tab.classList.add(`${TabPlugin.getConf().tabShownClass}`);
            this.activePair.tabContent.classList.add(`${TabPlugin.getConf().tabContentShownClass}`);
        }
    }

    static getConf() {
        return Object.freeze({
            tabClass: 'TabPlugin-tab',
            tabShownClass: 'TabPlugin-tab-shown',
            defaultTabClass: 'TabPlugin-tab-default',
            tabContentShownClass: 'TabPlugin-tab-content-shown',
            dataTargetTabContentId: 'is empty yet'
        });
    }
}