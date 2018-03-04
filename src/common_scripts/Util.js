class Util {
    static isDefinedVar(variable) {
        return typeof variable !== 'undefined';
    }

    static readFileAsTxt(file) {
        return new Promise(resolve => {
            const fileReader = new FileReader();

            fileReader.addEventListener('loadend', event => {
                const fileTxt = event.target.result;

                resolve(fileTxt);
            });

            fileReader.readAsText(file);
        });
    }

    static saveData(content, fileName) {
        const a = document.createElement('a');

        document.body.appendChild(a);
        // a.style = 'display: none';

        const blob = new Blob([content], {
            type: 'octet/stream'
        });
        const url = window.URL.createObjectURL(blob);

        a.innerHTML = "TEST";
        a.href = url;
        a.download = 'test';
        // console.log(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        // a.remove();
    }

    static saveData2(content, fileName) {
        const blob = new Blob([content], {
            type: 'octet/stream'
        });
        const url = window.URL.createObjectURL(blob);
        // blob.name = 'test';
        CONFIG.getAPI().browser.browserAPI.tabs.create({
            url: url
        });
        // window.URL.revokeObjectURL(url);
    }

    static openAsJson(json) {
        const blob = new Blob([json], {
            type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);

        CONFIG.getAPI().browser.browserAPI.tabs.create({
            url: url
        });
        // window.URL.revokeObjectURL(url);

    }
}



