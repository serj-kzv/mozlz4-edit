let engines = {};

// form
let BrutusinForms = null;
let bf = null;
let container = null;

document.addEventListener("DOMContentLoaded", event => {
    // buttons
    const selectBtn = document.querySelector('#selectMozlz4FileButton');
    const saveAsMozlz4Btn = document.querySelector('#saveAsMozlz4');
    const saveAsJSONBtn = document.querySelector('#saveAsJson');

    saveAsMozlz4Btn.addEventListener('click', function (event) {
        const enginesStr = JSON.stringify(engines);
        const file = writeMozlz4File(enginesStr);

        console.log(file.length);
        saveData(file, 'search.json.mozlz4');
    });

    saveAsJSONBtn.addEventListener('click', event => {
        const enginesJSONStr = JSON.stringify(bf.getData(), null, 4);

        console.log(bf.getData());

        saveData(enginesJSONStr, 'search.json');
    });

    selectBtn.addEventListener('change', event => {
        let file = event.target.files[0];
        console.log(file);

        readMozlz4File(file, function (text) {
            engines = JSON.parse(text);

            console.log(engines);

            createForm(schema, engines);
        });
    });

    function createForm(schema, engines) {
        BrutusinForms = brutusin["json-forms"];
        bf = BrutusinForms.create(schema);
        container = document.querySelector('#container');
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