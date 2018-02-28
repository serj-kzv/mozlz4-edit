let engines = {};

// form
let BrutusinForms = null;
let bf = null;
let container = null;

document.addEventListener("DOMContentLoaded", event => {
    document.querySelector('#saveAsMozlz4Btn')
        .addEventListener('click', function (event) {
            const enginesStr = JSON.stringify(engines);
            const file = writeMozlz4File(enginesStr);

            saveData(file, 'search.json.mozlz4');
        });

    document.querySelector('#saveAsJsonBtn')
        .addEventListener('click', event => {
            const enginesJSONStr = JSON.stringify(bf.getData(), null, 4);

            console.log(bf.getData());

            saveData(enginesJSONStr, 'search.json');
        });

    document.querySelector('#loadMozlz4FileBtn')
        .addEventListener('change', event => {
            let file = event.target.files[0];
            console.log(file);

            readMozlz4File(file, function (text) {
                engines = JSON.parse(text);

                console.log(engines);

                createForm(schema, engines);

                fillTxtResultField(JSON.stringify(engines, null, 4));
            });
        });
    document.querySelector('#loadJSONFileBtn')
        .addEventListener('change', event => {
            let file = event.target.files[0];
            console.log(file);

            readFileAsTxt(file, text => {
                engines = JSON.parse(text);

                console.log(engines);

                createForm(schema, engines);
                fillTxtResultField(text);
            });
        });

    function fillTxtResultField(txt) {
        document.querySelector('#txtResult').innerHTML = txt;
    }

    function readFileAsTxt(file, callBackFunc) {
        const fileReader = new FileReader();

        fileReader.addEventListener('loadend', event => {
            const fileTxt = event.target.result;

            callBackFunc(fileTxt);
        });

        fileReader.readAsText(file);
    }

    function createForm(schema, engines) {
        BrutusinForms = brutusin["json-forms"];
        bf = BrutusinForms.create(schema);
        container = document.querySelector('#list-container');
        bf.render(container, engines);
    }

    function saveData(content, fileName) {
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
});