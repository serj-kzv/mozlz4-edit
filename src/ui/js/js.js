let engines = {};
document.addEventListener("DOMContentLoaded", function (event) {
    // buttons
    const selectBtn = document.querySelector('#selectMozlz4FileButton');
    const saveAsMozlz4Btn = document.querySelector('#saveAsMozlz4');
    const saveAsJSONBtn = document.querySelector('#saveAsJson');

    // form
    const BrutusinForms = brutusin["json-forms"];
    const bf = BrutusinForms.create(schema);
    const container = document.querySelector('#container');

    saveAsMozlz4Btn.addEventListener('click', function (event) {
        const enginesStr = JSON.stringify(engines);


    });

    saveAsJSONBtn.addEventListener('click', function (event) {
        const enginesJSONStr = JSON.stringify(engines, null, 4);

        saveData(enginesJSONStr);
    });

    selectBtn.addEventListener('change', function onButtonPress(event) {
        let file = event.target.files[0];

        readMozlz4File(file, function (text) {
            engines = JSON.parse(text);

            console.log(engines);

            createForm(schema, engines);
        });
    });

    function createForm(schema, engines) {
        bf.render(container, engines);
    }

    function saveData(content) {
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style = 'display: none';

        const blob = new Blob([content], {
            type: 'octet/stream'
        });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = 'search.json';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
});