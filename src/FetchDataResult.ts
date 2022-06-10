'use strict';

import { OSISRef } from './models/OSISRef';
import { NoteInfo } from './models/NoteInfo';

export class NotesByOSISRef {
    notes: NoteInfo[];
    readonly osisRef: OSISRef;

    constructor(osisRef: OSISRef) {
        this.osisRef = osisRef;
        this.notes = [];
    }

    referenceString(): string {
        return this.osisRef.toString();
    }

    addNoteInfo(noteID: string, noteTitle: string): void {
        this.notes.push({ noteID: noteID, noteTitle: noteTitle } as NoteInfo);
    }

    hasNote(noteID: string): boolean {
        return (
            this.notes.find((element, index, array) => {
                return element.noteID === noteID;
            }) !== undefined
        );
    }

    removeNote(noteID: string) {
        this.notes = this.notes.filter((noteInfo) => noteInfo.noteID !== noteID);
    }
}
