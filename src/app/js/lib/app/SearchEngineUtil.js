class SearchEngineUtil {
    static createEngines(tmpls) {
        return tmpls.map(tmpl => SearchEngineUtil.createEngine(tmpl));
    }

    static createEngine(tmpl) {
        const
            name = tmpl.name,
            params = tmpl.params === undefined ? '' : tmpl.params.join('&'),
            url = `${tmpl.url}${params}`,
            icon = tmpl.icon;

        return {
            _name: `${name}`,
            _shortName: `${name}`,
            description: `${name}`,
            queryCharset: 'UTF-8',
            _readOnly: 'false',
            __searchForm: '',
            _iconURL: `${icon}`,
            _loadPath: `[other]/${name}.xml`,
            _metaData: {},
            _urls: [
                {
                    template: `${url}`,
                    rels: [],
                    resultDomain: '',
                    params: []
                }
            ]
        };
    }
}