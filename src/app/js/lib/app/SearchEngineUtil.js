class SearchEngineUtil {
    static createEngines(tmpls) {
        return tmpls.map(tmpl => SearchEngineUtil.createEngine(tmpl));
    }

    static createEngine(tmpl) {
        const name = tmpl.name, url = tmpl.url;

        return {
            _name: `${name}`,
            _shortName: `${name}`,
            description: `${name}`,
            queryCharset: 'UTF-8',
            _readOnly: 'false',
            __searchForm: '',
            _iconURL: '',
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