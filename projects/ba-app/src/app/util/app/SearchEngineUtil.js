export default class SearchEngineUtil {
    static createEngines(tmpls) {
        return tmpls.map(tmpl => SearchEngineUtil.createEngine(tmpl));
    }

    static createEngine(tmpl) {
        const
            tmplParams = tmpl.params,
            name = tmpl.name,
            params = tmplParams === undefined || tmplParams.length === 0 ? '' : `&${tmplParams.join('&')}`,
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

    static engineParamsToUrlParams(params) {
        return params.reduce((filtered, param) => {
            const
                name = param.name,
                value = param.value;

            if (value.length > 0) {
                const
                    urlParamValue = param.multi ? `${value.join(param.divider)}` : `${value}`,
                    filteredParam = filtered.find(p => p.name === name);

                if (filteredParam !== undefined) {
                    filteredParam.urlParam = `${filteredParam.urlParam}${param.andOrDivider}${urlParamValue}`;
                } else {
                    filtered.push({
                        name,
                        urlParam: `${name}=${urlParamValue}`
                    });
                }
            }

            return filtered;
        }, []);
    }
}