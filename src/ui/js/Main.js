let engines = {
    engines: []
};

document.addEventListener("DOMContentLoaded", event => {
    document.querySelector('#saveAsMozlz4Btn')
        .addEventListener('click', function (event) {
            const enginesStr = getTxtResultField();

            new Mozlz4Wrapper().encode(enginesStr).then(file => {
                saveData(file, 'search.json.mozlz4');
            });
        });

    document.querySelector('#saveAsJsonBtn')
        .addEventListener('click', event => {
            const enginesJSONStr = getTxtResultField();

            saveData(enginesJSONStr, 'search.json');
        });

    document.querySelector('#loadMozlz4FileBtn')
        .addEventListener('change', async event => {
            let file = event.target.files[0];
            const mozlz4Wrapper = new Mozlz4Wrapper();

            file = await mozlz4Wrapper.decode(file);

            const txt = new TextDecoder().decode(file);

            engines = JSON.parse(txt);

            console.log(engines);

            createForm(engines);
            setTxtResultField(engines);
        });
    document.querySelector('#loadJSONFileBtn')
        .addEventListener('change', event => {
            let file = event.target.files[0];

            readFileAsTxt(file, text => {
                engines = JSON.parse(text);

                createForm(engines);
                setTxtResultField(engines);
            });
        });

    document.querySelector('#openJSONInNewTabBtn')
        .addEventListener('click', event => {
            const enginesJSONStr = JSON.stringify(bf.getData(), null, 4);
            const blob = new Blob([enginesJSONStr], {
                type: 'application/json'
            });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        });
    document.querySelector('#addEngineExampleBtn')
        .addEventListener('click', event => {
            engines.engines.unshift(engineExample);
            createForm(engines);
        });


    function setTxtResultField(engines) {
        const txt = JSON.stringify(engines, null, 4);

        document.querySelector('#txtResult').value = txt;
    }

    function getTxtResultField() {
        return document.querySelector('#txtResult').value;
    }

    function readFileAsTxt(file, callBackFunc) {
        const fileReader = new FileReader();

        fileReader.addEventListener('loadend', event => {
            const fileTxt = event.target.result;

            callBackFunc(fileTxt);
        });

        fileReader.readAsText(file);
    }

    function createForm(engines) {

    }

    function clearForm(container) {
        container.innerHTML = '';
        bf.render(container, {});
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