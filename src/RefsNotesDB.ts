import joplin from 'api';
import { OSISRef } from './models/OSISRef';
import { NoteWithRefs, TNoteWithRefs } from './models/NoteWithRefs';
import { ReferenceMatcher } from './ReferenceMatcher';
import { Cache } from './Cache';
import { NotesByOSISRef } from './FetchDataResult';

export class RefsNotesDB {
    /**
     * A dictionary of the Notes indexed by the OSISRef's string
     * */
    osisRefsDictionary: { [id: string]: NotesByOSISRef };

    /**
     * A Dictionary of the notes indexed by the note_id
     * */
    notesDictionary: { [id: string]: NoteWithRefs };

    constructor() {
        this.notesDictionary = {};
        this.osisRefsDictionary = {};
        this.fillDB();
    }

    private addNotetoOSISRefsDictionary(noteWithRefs: NoteWithRefs) {
        var refs = noteWithRefs.refs;
        refs.forEach((r, i, a) => {
            const refString = r.toString();
            if (refString in this.osisRefsDictionary) {
                var n: NotesByOSISRef = this.osisRefsDictionary[refString];
                if (!n.hasNote(noteWithRefs.id)) {
                    n.addNoteInfo(noteWithRefs.id, noteWithRefs.title);
                }
            } else {
                this.osisRefsDictionary[refString] = new NotesByOSISRef(r);
                this.osisRefsDictionary[refString].addNoteInfo(
                    noteWithRefs.id,
                    noteWithRefs.title,
                );
            }
        });
    }

    static processNoteData(note): TNoteWithRefs {
        // Analyse note again.
        var refs = ReferenceMatcher.matchReferences(note['body']).concat(
            ReferenceMatcher.matchReferences(note['title']),
        );
        var uniqueRefs = ReferenceMatcher.uniqueReferences(refs);

        var tNote = new TNoteWithRefs(
            note['id'],
            note['title'],
            uniqueRefs,
            note['updated_time'],
        );
        return tNote;
    }

    async fillDB() {
        let pageNum = 1; // The start defaults to 1 according to the API documentation.
        do {
            var response = await joplin.data.get(['notes'], {
                fields: ['id', 'title', 'body', 'updated_time'],
                page: pageNum++,
            });

            response.items.forEach((note, _index, _array) => {
                var tNote: TNoteWithRefs;
                var uniqueRefs;
                if (!Cache.hasNote(note['id'])) {
                    // Analyse note.
                    tNote = RefsNotesDB.processNoteData(note);
                    uniqueRefs = tNote.refs;
                    Cache.setNote(note['id'], tNote);
                } // end of if cache has note
                else {
                    // Cache has note.
                    var cacheNote = Cache.getNote(note['id']);
                    if (note['updated_time'] > cacheNote.updatedTime) {
                        // Analyse note again.
                        tNote = RefsNotesDB.processNoteData(note);
                        uniqueRefs = tNote.refs;
                        Cache.setNote(note['id'], tNote);
                    } else {
                        tNote = cacheNote;
                        uniqueRefs = cacheNote['refs'];
                    }
                }
                if (uniqueRefs.length > 0) {
                    this.addNote(tNote);
                }
            });
        } while (response.has_more);
    }

    getNotesWithRefs(): NoteWithRefs[] {
        return Object.values(this.notesDictionary);
    }

    /**
     * Return true if the new data is different from the previous one.
     * */
    async updateNote(noteId: string): Promise<Boolean> {
        const note = await joplin.data.get(['notes', noteId], {
            fields: ['id', 'title', 'body', 'updated_time'],
        });
        var tNote = RefsNotesDB.processNoteData(note);
        // Check if this is different from the previous note.
        var cNote: TNoteWithRefs;
        var isSame: Boolean = false;
        if (Cache.hasNote(noteId)) {
            cNote = Cache.getNote(noteId);
            if (tNote.title == cNote.title && tNote.hasSameRefsAs(cNote)) {
                isSame = true;
            }
        }
        Cache.setNote(note['id'], tNote);
        if (!isSame) {
            // I need to update the dictonaries
            this.removeNote(noteId);
            this.addNote(tNote);
        }
        return !isSame;
    }

    private removeNoteFromOSISRefsDictionary(note: NoteWithRefs) {
        var noteId: string = note.id;
        note.refs.forEach((osisRef, i, a) => {
            var refString = osisRef.toString();
            var notesByOSISRefs: NotesByOSISRef =
                this.osisRefsDictionary[refString];
            notesByOSISRefs.removeNote(noteId);

            if (notesByOSISRefs.notes.length == 0) {
                delete this.osisRefsDictionary[refString];
            }
        });
    }

    removeNote(noteId: string): void {
        var note = this.notesDictionary[noteId];
        if (note !== undefined) {
            this.removeNoteFromOSISRefsDictionary(note);
            delete this.notesDictionary[noteId];
        }
    }

    addNote(note: NoteWithRefs): void {
        this.notesDictionary[note.id] = note;
        this.addNotetoOSISRefsDictionary(note);
    }

    /**
     * Retrieves id of notes
     * */
    getNotesForOSISRef(osisString: string): NotesByOSISRef[] {
        if (osisString === '') {
            // Return all the notes in the database
            return Object.values(this.osisRefsDictionary);
        } else {
            return [this.osisRefsDictionary[osisString]];
        }
    }

    /**
     *
     * */
    getOSISRefsForNoteID(noteId: string): OSISRef[] {
        if (this.notesDictionary[noteId] !== undefined) {
            return this.notesDictionary[noteId].refs;
        }
        return [];
    }
}
