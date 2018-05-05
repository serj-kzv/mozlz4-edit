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
        const type = engines.types.filter(type => type.name === 'General')[0];
        const engine = type.engines.filter(engine => engine.name === 'Google')[0];
        const params = engine.params;
        const paramNames = Object.keys(this.getConf());
        // let param = engine.params.filter(param => param.param === 'hl')[0];

        for (let paramName of paramNames) {
            let param = FetchGoogleParams.getParamObj(params, paramName);

            param.values = await this.fetchParams(this.getConf()[`${paramName}`]);
        }

        console.log(JSON.stringify(engines));
    }

    static getParamObj(params, name) {
        const param = params.filter(param => param.param === name)[0];

        if (param.length === 0) {
            param[`${name}`] = [];
        }

        return param;
    }

    static async fetchParams(conf) {
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
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'table:nth-child(53) tr:not(:first-child)'
            },
            // Language Collection Values
            lr: {
                url: 'https://developers.google.com/custom-search/docs/xml_results_appendices',
                selector: 'table:nth-child(57) tr:not(:first-child)'
            }
        });
    }
}