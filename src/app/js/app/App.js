import BrowserApi from '../lib/app/BrowserApi.js';
import FileUtil from '../lib/app/fileUtil/FileUtil.js';
import OpenFileUtil from '../lib/app/fileUtil/OpenFileUtil.js';
import SaveFileUtil from '../lib/app/fileUtil/SaveFileUtil.js';
import IconUtil from '../lib/app/IconUtil.js';
import ModalPlugin from '../lib/app/modal/ModalPlugin.js';
import MozLz4ArchiverCommandMozLz4 from '../lib/app/mozLz4Archiver/command/MozLz4ArchiverCommandMozLz4.js';
import MozLz4Archiver from '../lib/app/mozLz4Archiver/MozLz4ArchiverImpl.js';
import SearchEngineUtil from '../lib/app/SearchEngineUtil.js';
import TabPlugin from '../lib/app/tab/TabPlugin.js';
import TrimHtmlWhiteSpace from '../lib/app/TrimHtmlWhiteSpace.js';
import AppCfg from './parts/AppCfg.js';

export default class App {
    constructor() {
    }

    async run() {
        this.runOnDOMloadend();
    }

    runOnDOMloadend() {
        document.addEventListener("DOMContentLoaded", async event => {
            this.appCfg = await AppCfg.build();
        });
    }
}