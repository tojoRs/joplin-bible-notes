import { NotesByOSISRef } from "./FetchDataResult";

export enum PluginEventType {
    FETCH_RESULT,
}

export class PluginEvent {
    type: PluginEventType;
    value : any;

    constructor(type : PluginEventType) {
        this.type = type;
    }
}
