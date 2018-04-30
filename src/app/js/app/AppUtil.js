class AppUtil {
    static createTabs(resourceTypes) {
        return resourceTypes.types.map(type => AppUtil.createTab(type));
    }

    static createTab(type) {
        const engines = SearchEngineUtil.createEngines(type.engines);

        return engines.map(engine => AppUtil.createEngineTabTag(type.name, engines));
    }

    static createEngineTabTag(name, engines) {
        let tabNameId = 'tabNameTmpl', tabContentId = 'tabContentTmpl';
        const
            tabNameTag = document.querySelector(`#${tabNameId}`).cloneNode(),
            tabContentTag = document.querySelector(`#${tabContentId}`).cloneNode();

        tabNameId = `${tabNameId}-${name}`;
        tabContentId = `${tabContentId}-${name}`;
        tabNameTag.id = tabNameId;
        tabNameTag.dataset.targetTabContentId = tabContentId;
        tabContentTag.id = tabContentId;
        engines.forEach(engine => tabContentTag.appendChild(AppUtil.createEngineTag(engine)));

        return {
            name: tabNameTag,
            content: tabContentTag
        };
    }

    static createEngineTag(engine) {
        const
            id = 'engineTmpl',
            engineTag = document.querySelector(`#${id}`).cloneNode();

        engineTag.id = `${id}-${engine.name}`;

        return engineTag;
    }
}