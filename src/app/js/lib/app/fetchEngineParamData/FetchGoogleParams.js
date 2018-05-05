/**
 * https://developers.google.com/custom-search/docs/xml_results_appendices
 * https://developers.google.com/custom-search/json-api/v1/reference/cse/list

 0: "Boolean AND [.]"
 ​
 1: "Boolean NOT [-]"
 ​
 2: "Boolean OR [|]"
 ​
 3: "Boolean Parentheses [()]"
 ​
 4: "Hexadecimal\nEncoding"
 ​
 5: "URL Escaped String"
 ​
 6: "Associated Supported Languages"
 ​
 7: "hl Parameter Value"
 ​
 8: "lr Parameter Value"
 ​
 9: "Country Collection Name"
 ​
 10: "Country Code"

 */
class FetchGoogleParams {
    static async fetch() {
        const url = browser.runtime.getURL('app/resources/engines.json');
        const engines = await (await fetch(url)).json();
        const type = engines.types.find(type => type.name === 'General');
        const engine = type.engines.find(engine => engine.name === 'Google');
        const params = engine.params === undefined ? engine.params = [] : engine.params;
        const paramNames = Object.keys(this.getConf());

        for (let paramName of paramNames) {
            const param = FetchGoogleParams.getParamByName(params, paramName);
            const confParam = this.getConf()[`${paramName}`];

            param.name = confParam.name;
            param.param = confParam.param;
            param.values = await this.fetchValues(confParam);
        }

        const filledEnginesJson = JSON.stringify(engines, null, 4);

        OpenFileUtil.openAsJson(filledEnginesJson);
    }

    static getParamByName(params, paramName) {
        let param = params.find(param => param.param === paramName);

        if (param === undefined) {
            param = {};
            params.push(param);
        }

        return param;
    }

    static async fetchValues(conf) {
        const iframe = document.createElement("iframe");

        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const html = await (await fetch(conf.url)).text();

        iframe.contentDocument.write(html);

        const params = this.findParams(iframe.contentDocument, conf);

        iframe.remove();

        return params;
    }

    static findParams(doc, conf) {
        return Array.from(doc.querySelectorAll(conf.selector)).map(tr => {
            return {
                name: tr.children[0].innerText.trim(),
                value: tr.children[1].innerText.trim()
            }
        });
    }

    static getConf() {
        return Object.freeze({
            // Supported Interface Languages
            hl: {
                name: "Web Interface Language Codes",
                param: "hl",
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'table:nth-child(53) tr:not(:first-child)'
            },
            // Language Collection Values
            lr: {
                name: "Search Language Codes",
                param: "lr",
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'table:nth-child(57) tr:not(:first-child)'
            },
            cr: {
                name: "Country Collection Values",
                param: "cr",
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'table:nth-child(61) tr:not(:first-child)'
            },
            gl: {
                name: "Country Codes",
                param: "gl",
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'table:nth-child(65) tr:not(:first-child)'
            }
        });
    }
}