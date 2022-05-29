import { OSISRef } from './models/OSISRef';

export enum WebviewEventType {
    CLICK_NOTE,
    SOME_MESSAGE,
    FETCH_DATA,
    ACCEPT_RESPONSE,
    GET_SETTING,
}

export class WebviewEvent {
    type: WebviewEventType;
    constructor(type) {
        this.type = type;
    }
}

export class ClickNoteEvent extends WebviewEvent {
    noteId: string;

    constructor(noteId) {
        super(WebviewEventType.CLICK_NOTE);
        this.noteId = noteId;
    }
}

export class SomeMessageEvent extends WebviewEvent {
    message: string;

    constructor(message) {
        super(WebviewEventType.SOME_MESSAGE);
        this.message = message;
    }
}

export class FetchDataEvent extends WebviewEvent {
    query: string;

    constructor(query) {
        super(WebviewEventType.FETCH_DATA);
        this.query = query;
    }
}

export class GetSettingEvent extends WebviewEvent {
    setting: string;
    constructor(setting) {
        super(WebviewEventType.GET_SETTING);
        this.setting = setting;
    }
}
