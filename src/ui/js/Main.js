var Buffer = require('buffer').Buffer
var LZ4 = require('lz4')

let engines = {};

// form
let BrutusinForms = null;
let bf = null;
let container = null;

document.addEventListener("DOMContentLoaded", event => {

    // Some data to be compressed
    var data = 'Рус Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    data += data

    console.log(data);

    // LZ4 can only work on Buffers
    var input = new Buffer(data)
    // Initialize the output buffer to its maximum length based on the input data
    var output = new Buffer( LZ4.encodeBound(input.length) )

    // block compression (no archive format)
    var compressedSize = LZ4.encodeBlock(input, output)
    // remove unnecessary bytes
    output = output.slice(0, compressedSize)

    console.log( "compressed data", output.slice(0, compressedSize) )

    // block decompression (no archive format)
    var uncompressed = new Buffer(input.length)
    var uncompressedSize = LZ4.decodeBlock(output, uncompressed)
    uncompressed = uncompressed.slice(0, uncompressedSize)

    console.log( "uncompressed data", uncompressed )
    console.log( "uncompressed data", new TextDecoder().decode(uncompressed) )

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
                console.log(text);
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