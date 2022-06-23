import joplin from 'api';
import { OSISRef } from './models/OSISRef';
import { NoteWithRefs, TNoteWithRefs } from './models/NoteWithRefs';
import { ReferenceMatcher } from './ReferenceMatcher';
import { Cache } from './Cache';

class NotesMap extends Map<string, NoteWithRefs> {
    constructor() {
        super();
    }
}

/**
 * This class has to synchronize both maps :
 * */
export class RefsNotesDB {
    /**
     * A Dictionary of the notes indexed by the note_id
     * */
    private notesMap: NotesMap;

    constructor() {
        this.notesMap = new NotesMap();
        this.fillDB();
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
        console.log(this.notesMap);
        return Array.from(this.notesMap.values());
    }

    async hasTitleChanged(noteId: string): Promise<Boolean> {
        const note = await joplin.data.get(['notes', noteId], {
            fields: ['id', 'title', 'updated_time'],
        });

        var isSame: Boolean = false;
        var cNote: TNoteWithRefs;

        if (Cache.hasNote(noteId)) {
            cNote = Cache.getNote(noteId);
            if (note['title'] === cNote.noteTitle) {
                isSame = true;
            }
        }
        return isSame;
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
            if (
                tNote.noteTitle === cNote.noteTitle &&
                tNote.hasSameRefsAs(cNote)
            ) {
                isSame = true;
            }
        }
        Cache.setNote(note['id'], tNote);
        if (!isSame) {
            // I need to update the dictionaries
            this.removeNote(noteId);
            this.addNote(tNote);
        }
        return !isSame;
    }

    removeNote(noteId: string): void {
        if (this.notesMap.has(noteId)) {
            this.notesMap.delete(noteId);
        }
    }

    addNote(note: NoteWithRefs): void {
        this.notesMap.set(note.noteID, note);
    }

    getNoteFromID(note_id: string): NoteWithRefs {
        return this.notesMap.get(note_id);
    }

    /**
     *
     * */
    getOSISRefsForNoteID(noteId: string): OSISRef[] {
        if (this.notesMap.has(noteId)) {
            return this.notesMap[noteId].refs;
        }
        return [];
    }
}
