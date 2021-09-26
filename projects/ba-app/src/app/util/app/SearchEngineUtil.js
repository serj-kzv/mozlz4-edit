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
        console.log(params)
        return params.reduce((filtered, param) => {
            console.log(param)
            const {name, value, multi, divider, andOrDivider} = param;

            if (value.length > 0) {
                const
                    urlParamValue = multi ? `${value.join(divider)}` : `${value}`,
                    filteredParam = filtered.find(p => p.name === name);

                if (filteredParam !== undefined) {
                    filteredParam.urlParam = `${filteredParam.urlParam}${andOrDivider}${urlParamValue}`;
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
                divider: dataset.multiDivider,
                andOrDivider: dataset.multiAndOrDivider
            };
        });
    }
}
