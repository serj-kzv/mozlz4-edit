class SearchEngineUtil {
    static createEngines(tmpls) {
        return tmpls.map(tmpl => SearchEngineUtil.createEngine(tmpl));
    }

    static createEngine(tmpl) {
        const
            tmplParams = SearchEngineUtil.engineParamsToUrlParams(tmpl.params).map(p => p.urlParam),
            name = tmpl.name,
            params = tmplParams === undefined || tmplParams.length === 0 ? '' : `&${tmplParams.join('&')}`,
            url = `${tmpl.url}${params}`,
            icon = tmpl.icon;

        console.log(params);

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

    /**
     *  Divider between OR and AND parameter strings is OR
     *  Example (for Google):
     *      Concatenated string parameters of 'ru.en.it' and 'gr|ch' is 'ru.en.it|gr|ch'
     */
    static engineParamsToUrlParams(params) {
        return params.reduce((filtered, param) => {
            const
                name = param.name,
                value = param.value;

            if (value.length > 0) {
                const
                    urlParamValue = param.multi ? `${value.join(param.divider)}` : `${name}=${value}`,
                    filteredParam = filtered.find(p => p.name === name);

                if (filteredParam !== undefined) {
                    let orDivider = filteredParam.orDivider;

                    orDivider = orDivider === undefined ? param.divider : orDivider;

                    console.log(param);
                    console.log(filteredParam);
                    filteredParam.urlParam = `${filteredParam.urlParam}${orDivider}${urlParamValue}`;
                } else {
                    filtered.push({
                        name,
                        urlParam: `${name}=${urlParamValue}`,
                        orDivider: param.multiType === 'or' ? param.divider : undefined
                    });
                }
            }

            return filtered;
        }, []);
    }
}