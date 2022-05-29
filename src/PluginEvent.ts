"use strict";

import { TNoteWithRefs } from './models/NoteWithRefs';

export enum PluginEventType {
    FETCH_RESULT,
    NOTE_UPDATE,
	SETTING_MESSAGE,
}

interface Setting {
	name : string;
	value : any;
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

export class SettingEvent extends PluginEvent {
	constructor(setting : Setting) {
		super(PluginEventType.SETTING_MESSAGE);
		this.value = setting;
	}
}
