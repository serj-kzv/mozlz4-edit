import FileUtil from '../../lib/app/fileUtil/FileUtil.js';
import OpenFileUtil from '../../lib/app/fileUtil/OpenFileUtil.js';
import SaveFileUtil from '../../lib/app/fileUtil/SaveFileUtil.js';
import MozLz4ArchiverCommandMozLz4 from '../../lib/app/mozLz4Archiver/command/MozLz4ArchiverCommandMozLz4.js';
import MozLz4Archiver from '../../lib/app/mozLz4Archiver/MozLz4ArchiverImpl.js';
import TrimHtmlWhiteSpace from '../../lib/app/TrimHtmlWhiteSpace.js';

export default class AppEditor {
    constructor() {
        this.engines = null;
        this.codeMirrorFileContent = null;

        // parts
        this.appCfg = null;

        // fields
        this.mozHeader = null;
        this.mozHeaderTxt = null;
        this.mozDecompSize = null;
        this.mozDecompSizeTxt = null;
        this.fileInfo = null;
        this.typeName = null;

        // buttons
        this.saveAsMozlz4Btn = null;
        this.saveAsJsonBtn = null;
        this.openFileBtn = null;
        this.openJSONInNewTabBtn = null;
    }

    async init() {
        await this.initUIElements();
        this.initListeners();
    }


    async initUIElements() {
        // fields
        this.mozHeader = document.querySelector('#mozHeader');
        this.mozHeaderTxt = document.querySelector('#mozHeaderTxt');
        this.mozDecompSize = document.querySelector('#mozDecompSize');
        this.mozDecompSizeTxt = document.querySelector('#mozDecompSizeTxt');
        this.fileInfo = document.querySelector('#fileInfo');
        this.typeName = document.querySelector('#typeName');

        // buttons
        this.saveAsMozlz4Btn = document.querySelector('#saveAsMozlz4Btn');
        this.saveAsJsonBtn = document.querySelector('#saveAsJsonBtn');
        this.openFileBtn = document.querySelector('#openFileBtn');
        this.openJSONInNewTabBtn = document.querySelector('#openJSONInNewTabBtn');

        TrimHtmlWhiteSpace.trim(document.body);
    }

    initEngines() {
        this.engines = {
            engines: []
        };
    }

    initListeners() {
        this.initEngines();
        this.initEditor();
        this.initSaveAsMozlz4Btn();
        this.initSaveAsJsonBtn();
        this.initOpenFileBtn();
        this.initOpenJSONInNewTabBtn();
    }

    initEditor() {
        this.codeMirrorFileContent = CodeMirror.fromTextArea(
            document.querySelector('#txtResult'),
            {
                mode: "javascript",
                theme: "liquibyte",
                lineNumbers: true,
                viewportMargin: Infinity,
                maxHighlightLength: Infinity,
                styleActiveLine: true,
                matchBrackets: true
            }
        );
    }

    initSaveAsMozlz4Btn() {
        this.saveAsMozlz4Btn.addEventListener('click', async event => {
            let file = this.codeMirrorFileContent.getValue();
            const fileName = this.fileInfo.value;

            file = MozLz4Archiver.compress(file, new MozLz4ArchiverCommandMozLz4());

            try {
                await SaveFileUtil.saveData(file, fileName, this.downloadType);
            } catch (e) {
                alert(`An error! Possibly the file '${fileName}' is busy. Close programs that can use the file and try again.`);
            }
        });
    }

    initSaveAsJsonBtn() {
        this.saveAsJsonBtn
            .addEventListener('click', async event => {
                const
                    enginesJSONStr = this.codeMirrorFileContent.getValue(),
                    fileName = `${this.fileInfo.value}.json`;

                try {
                    await SaveFileUtil.saveData(enginesJSONStr, fileName, this.downloadType);
                } catch (e) {
                    alert(`An error! Possibly the file '${fileName}' is busy. Close programs that can use the file and try again.`);
                }
            });
    }

    clrFileInfoBlock() {
        this.clearMozHeader();
        this.clearMozDecompSize();
        this.fileInfo.value = '';
        this.typeName.value = '';
    }

    initOpenFileBtn() {
        this.openFileBtn
            .addEventListener('change', async event => {
                this.setStatusLoading();
                this.clrFileInfoBlock();

                try {
                    let file = event.target.files[0];

                    const fileName = file.name;

                    file = await FileUtil.readFileAsUint8Array(file);
                    file = MozLz4Archiver.decompress(file);

                    if (file.header !== '') {
                        this.setMozHeader(file.header);
                    }

                    if (file.decompressSizeHeader !== '') {
                        this.setMozDecompSize(file.decompressSizeHeader, file.decompressSize);
                    }

                    this.fileInfo.value = fileName;
                    this.typeName.value = file.typeName;

                    const fileTxt = new TextDecoder().decode(file.file);

                    try {
                        this.engines = JSON.parse(fileTxt);
                        this.setTxtResultField(this.codeMirrorFileContent, this.engines);
                    } catch (jsonParseEx) {
                        this.setTxtResultFieldTxt(this.codeMirrorFileContent, fileTxt);
                    }
                } catch (e) {
                    console.error(e);
                    this.setStatusFail();
                }
            });
    }

    initOpenJSONInNewTabBtn() {
        this.openJSONInNewTabBtn.addEventListener('click', event => {
            const json = this.codeMirrorFileContent.getValue();

            OpenFileUtil.openAsJson(json);
        });

        // to work as a page, we will block broken 'open in new tab' function
        if (typeof browser === 'undefined') {
            this.openJSONInNewTabBtn.disabled = true;
        }
    }

    updateDataSource() {
        this.engines = JSON.parse(this.codeMirrorFileContent.getValue());
    }

    updateEditor() {
        this.setTxtResultField(this.codeMirrorFileContent, this.engines);
    }

    setTxtResultField(codeMirror, engines) {
        const txt = JSON.stringify(engines, null, 4);

        codeMirror.setValue(txt);
    }

    setTxtResultFieldTxt(codeMirror, txt) {
        codeMirror.setValue(txt);
    }

    setStatusLoading() {
        this.setTxtResultField(this.codeMirrorFileContent, 'Loading... Wait.');
    }

    setStatusFail() {
        this.setTxtResultField(this.codeMirrorFileContent, 'Fail! Try again.');
    }

    setMozHeader(val) {
        this.mozHeader.value = val;
        this.mozHeaderTxt.value = new TextDecoder().decode(val);
    }

    clearMozHeader() {
        this.mozHeader.value = '';
        this.mozHeaderTxt.value = '';
    }

    clearMozDecompSize() {
        this.mozDecompSize.value = '';
        this.mozDecompSizeTxt.value = '';
    }

    setMozDecompSize(decompressSizeHeader, decompressSize) {
        this.mozDecompSize.value = decompressSizeHeader;
        this.mozDecompSizeTxt.value = decompressSize;
    }
}