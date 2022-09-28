import {Component, Input, OnInit} from '@angular/core';
import decompressFn from '../../util/app/mz4-archiver/decompressFn.js';
import compressAsMozlz4Fn from '../../util/app/mz4-archiver/compressAsMozlz4Fn.js';
import readFileAsTxtFn from '../../util/file/readFileAsTxtFn.js';
import saveAsDataFn from '../../util/ext/file/saveAsDataFn.js';
import saveAsDataLinkFn from '../../util/ext/file/saveAsDataLinkFn.js';
import openAsJsonFn from '../../util/ext/file/openAsJsonFn.js';
import MozLz4ArchiverCommandType from '../../util/app/mz4-archiver/command/MozLz4ArchiverCommandType.js';
import {EngineBridgeService} from "../../core/service/engine-bridge.service";
import {ReplaySubject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-archiver',
    templateUrl: './archiver.component.html',
    styleUrls: ['./archiver.component.scss']
})
export class ArchiverComponent implements OnInit {
    @Input() engines: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private readonly fileInfo = {
        name: 'file.mozlz4',
        size: -1
    };

    constructor(public engineBridgeService: EngineBridgeService) {
    }

    ngOnInit(): void {
        this.engineBridgeService.add$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(engine => {
                try {
                    const editorEngines = JSON.parse(this.engines);

                    if (editorEngines.engines) {
                        if (editorEngines.engines.some(engineItem => engineItem['_name'] === engine['_name'])) {
                            alert('Error. The engine name is existed. Rename the engine and try again!');
                        } else {
                            editorEngines.engines.push(engine);
                            this.engines = JSON.stringify(editorEngines, null, 4);
                        }
                    } else {
                        alert('Error. No engine list in the opened file!');
                    }
                } catch (e) {
                    alert('Error. JSON is invalid!');
                }
            })
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    async openMozLz4File($event) {
        this.engines = 'Loading... Wait.';

        const sourceFile = $event.files[0];
        this.fileInfo.name = sourceFile.name;
        const decompressed = await decompressFn(sourceFile);
        const {file, command} = decompressed;
        const {typeName} = command;
        const txt = MozLz4ArchiverCommandType.isNone(typeName) ? await readFileAsTxtFn(file) : new TextDecoder().decode(file);

        if (MozLz4ArchiverCommandType.isMozLz4(typeName)) {
            try {
                this.engines = JSON.stringify(JSON.parse(txt), null, 4);
            } catch (e) {
                this.engines = txt;
            }
        } else if (MozLz4ArchiverCommandType.isMozJSSCLz40v001(typeName)) {
            // TODO: The support of 'mozJSSCLz40v001' was not finished so we just open it as is.
            this.engines = txt;
        } else {
            this.engines = txt;
        }
    }

    async saveAsMozLz4File() {
        let {name: fileName} = this.fileInfo;
        const file = compressAsMozlz4Fn(this.engines);

        if (fileName.length === 0) {
            fileName = 'file.mozlz4';
        } else if (['.lz4', '.mozlz4', '.jsonlz4', '.baklz4'].every(ext => !fileName.endsWith(ext))) {
            fileName = `${fileName}.mozlz4`;
        }

        try {
            await saveAsDataFn(file, 'octet/stream', false, fileName);
        } catch (e) {
            alert(`An error! Possibly the file '${fileName}' is busy. Close programs that can use the file and try again.`);
        }
    }

    async saveAsJsonFile() {
        let {name: fileName} = this.fileInfo;

        if (fileName.length === 0) {
            fileName = 'file.json';
        } else if (!fileName.endsWith('.json')) {
            fileName = `${fileName}.json`;
        }

        try {
            await saveAsDataFn(this.engines, 'octet/stream', false, fileName);
        } catch (e) {
            alert(`An error! Possibly the file '${fileName}.json' is busy. Close programs that can use the file and try again.`);
        }
    }

    formatJson() {
        try {
            this.engines = JSON.stringify(JSON.parse(this.engines), null, 4);
        } catch (e) {
            alert('Error. JSON is invalid!');
        }
    }

    openTxtInNewTab() {
        openAsJsonFn(this.engines);
    }

    async saveAsMozLz4FileWithDialogue() {
        let {name: fileName} = this.fileInfo;
        const file = compressAsMozlz4Fn(this.engines);

        if (fileName.length === 0) {
            fileName = 'file.mozlz4';
        } else if (['.lz4', '.mozlz4', '.jsonlz4', '.baklz4'].every(ext => !fileName.endsWith(ext))) {
            fileName = `${fileName}.mozlz4`;
        }

        try {
            await saveAsDataLinkFn(file, 'octet/stream', false, fileName);
        } catch (e) {
            alert(`An error! Possibly the file '${fileName}' is busy. Close programs that can use the file and try again.`);
        }
    }

    async saveAsJsonFileWithDialogue() {
        let {name: fileName} = this.fileInfo;

        if (fileName.length === 0) {
            fileName = 'file.json';
        } else if (!fileName.endsWith('.json')) {
            fileName = `${fileName}.json`;
        }

        try {
            await saveAsDataLinkFn(this.engines, 'octet/stream', false, fileName);
        } catch (e) {
            alert(`An error! Possibly the file '${fileName}.json' is busy. Close programs that can use the file and try again.`);
        }
    }
}
