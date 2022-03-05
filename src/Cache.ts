import { TNoteWithRefs } from './models/NoteWithRefs';
export namespace Cache {
    /**
     * Use _notekey to avoid messing with the storage and by the same time key collisions.
     * */
    function _notekey(id: string): string {
        return 'note-' + id;
    }

    function isNotekey(id: string): boolean {
        return id.startsWith(_notekey(''));
    }
    /**
     * Remove all elements from the cache
     * */
    export function clear() {
        var keys = Object.keys(localStorage);
        var i = keys.length;

        while (i--) {
            if (isNotekey(keys[i])) {
                localStorage.removeItem(keys[i]);
            }
        }
    }

    export function hasNote(id: string): boolean {
        return localStorage.getItem(_notekey(id)) !== null;
    }

    export function getNote(id: string): TNoteWithRefs {
        var jsonNote = JSON.parse(localStorage.getItem(_notekey(id)));
        return TNoteWithRefs.fromJSON(jsonNote);
    }

    export function setNote(id: string, n: TNoteWithRefs): void {
        localStorage.setItem(_notekey(id), JSON.stringify(n));
    }
}
