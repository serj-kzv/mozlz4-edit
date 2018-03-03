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
        a.style = 'display: none';

        const blob = new Blob([content], {
            type: 'octet/stream'
        });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    static saveData2(content, fileName) {
        const blob = new Blob([content], {
            type: 'octet/stream'
        });
        const url = window.URL.createObjectURL(blob);

        window.open(url);
    }

    static openAsJson(json) {
        const blob = new Blob([json], {
            type: 'application/json'
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
    }
}



