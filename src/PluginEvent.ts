"use strict";

import { TNoteWithRefs } from './models/NoteWithRefs';

export enum PluginEventType {
    FETCH_RESULT,
    NOTE_UPDATE,
}

export class PluginEvent {
    type: PluginEventType;
    value: any;

    constructor(type: PluginEventType) {
        this.type = type;
    }
}

export class NoteUpdateEvent extends PluginEvent {
    constructor(noteData) {
        super(PluginEventType.NOTE_UPDATE);
        this.value = noteData;
    }
}
