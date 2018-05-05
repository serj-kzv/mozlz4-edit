/**
 * https://developers.google.com/custom-search/docs/xml_results_appendices
 * https://developers.google.com/custom-search/json-api/v1/reference/cse/list
 */
class FetchGoogleParams {
    static async fetch() {
        const url = browser.runtime.getURL('app/resources/engines.json');
        const engines = await (await fetch(url)).json();
        const type = engines.types.filter(type => type.name === 'General')[0];
        const engine = type.engines.filter(engine => engine.name === 'Google')[0];
        let param = engine.params.filter(param => param.param === 'hl')[0];

        param.values = await FetchGoogleParams.fetchParams(FetchGoogleParams.getConf().webInterfaceLanguageCodes);

        param = engine.params.filter(param => param.param === 'lr')[0];

        param.values = await FetchGoogleParams.fetchParams(FetchGoogleParams.getConf().searchLanguageCodes);

        console.log(JSON.stringify(engines));
    }

    static async fetchParams(conf) {
        const html = await (await fetch(conf.url)).text();
        const div = document.createElement("div");

        div.style.display = 'none';
        document.body.appendChild(div);
        div.innerHTML = html;

        const params = await this.findParams(div, conf);

        // iframe.remove();

        return params;
    }

    static async findParams(div, conf) {
        console.log(div)
        const trs = Array.from(div.querySelectorAll(conf.selector));
        console.log(trs)
        const params = trs.map(tr => {
            return {
                name: tr.children[0].innerText.trim(),
                value: tr.children[1].innerText.trim()
            }
        });

        console.log(params)

        return params;
    }

    static getConf() {
        return Object.freeze({
            webInterfaceLanguageCodes: {
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'div.devsite-table-wrapper:nth-child(53) > table:nth-child(1) > tbody:nth-child(1) > tr:not(:first-child)'
            },
            searchLanguageCodes: {
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'div.devsite-table-wrapper:nth-child(57) > table:nth-child(1) > tbody:nth-child(1) > tr:not(:first-child)'
            }
        });
    }
}