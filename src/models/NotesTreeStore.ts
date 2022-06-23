'use strict';

import { NotesTree } from './NotesTree';
import { NoteWithRefs, OSISRefOffset } from './NoteWithRefs';
import { NoteInfo } from './NoteInfo';
import { OSISRef } from './OSISRef';

export class NotesTreeStore extends NotesTree {
    private notesMap: Map<string, NoteWithRefs>;

    constructor(id: string = 'root') {
        super(id);
        this.notesMap = new Map<string, NoteWithRefs>();
    }

    addNoteWithRefs(noteWithRefs: NoteWithRefs): void {
        var id: string = noteWithRefs.noteID;
        if (this.notesMap.has(id)) {
            let storedN: NoteWithRefs = this.notesMap.get(id);

            if (storedN.noteTitle === noteWithRefs.noteTitle) {
                // It's really the same
                // We only have to apply the offset.
                let offset: OSISRefOffset = storedN.offset(noteWithRefs);
                this.applyOffset(offset, noteWithRefs);
            } else {
                // The title has changed.
                // So we need to remove all the references to the note.
                for (let i in storedN.refs) {
                    this.removeNoteAt(storedN.refs[i], storedN);
                }
                for (let j in noteWithRefs.refs) {
                    this.addNote(noteWithRefs.refs[j], noteWithRefs);
                }
            }
        } else {
            for (let i in noteWithRefs.refs) {
                this.addNote(noteWithRefs.refs[i], noteWithRefs);
            }
        }

        // And in all cases
        this.notesMap.set(noteWithRefs.noteID, noteWithRefs);
    }

    private applyOffset(offset: OSISRefOffset, noteInfo: NoteInfo): void {
        for (var i in offset.removed) {
            this.removeNoteAt(offset.removed[i], noteInfo);
        }

        for (var j in offset.added) {
            this.addNote(offset.added[j], noteInfo);
        }
    }
}
