'use strict';

import { NoteInfo } from './NoteInfo';
import { OSISRef } from './OSISRef';
import { pathFromOSISRef, compareStructureIds } from './OSISPath';

export interface RefNote {
    osisRef: OSISRef;
    noteInfo: NoteInfo;
}

export class NotesNode {
    private id: string;
    private children: Map<string, NotesNode>;
    private notes: RefNote[];

    constructor(id: string) {
        this.id = id;
        this.children = new Map<string, NotesNode>();
        this.notes = [];
    }

    getChildren(): Map<string, NotesNode> {
        return this.children;
    }

    getNotes(): RefNote[] {
        return this.notes;
    }

    notesCount(): number {
        var childrenNotesCount = 0;
        this.children.forEach((node, key) => {
            childrenNotesCount += node.notesCount();
        });

        return childrenNotesCount + this.notes.length;
    }

    /**
     *
     * @returns true if the note has been added, false if the note was already there.
     * */
    addNoteToPath(
        osisRef: OSISRef,
        path: string[],
        noteInfo: NoteInfo,
    ): boolean {
        let added: boolean = false;
        if (path.length == 0) {
            if (
                this.notes.find((refNoteElement) => {
                    return (
                        refNoteElement.noteInfo.noteID == noteInfo.noteID &&
                        refNoteElement.osisRef.isEqual(osisRef)
                    );
                }) === undefined
            ) {
                this.notes.push({ osisRef: osisRef, noteInfo: noteInfo });
                this.notes = this.notes.sort((n1, n2) => {
                    return n1.osisRef.compare(n2.osisRef);
                });
                added = true;
            }
        } else {
            if (this.children.has(path[0])) {
                added = this.children
                    .get(path[0])
                    .addNoteToPath(osisRef, path.slice(1), noteInfo);
            } else {
                let child = new NotesNode(path[0]);
                added = child.addNoteToPath(osisRef, path.slice(1), noteInfo);

                // Order keys. Working but I think very costly
                // The problem of this is that they cannot be reordered at will.
                this.children.set(path[0], child);
                var orderedMap = new Map<string, NotesNode>(
                    [...this.children.entries()].sort((child1, child2) => {
                        return compareStructureIds(child1[0], child2[0]);
                    }),
                );
                this.children = orderedMap;
            }
        }
        return added;
    }

    removeNoteAtPath(
        osisRef: OSISRef,
        path: string[],
        noteInfo: NoteInfo,
    ): void {
        if (path.length == 0) {
            this.notes = this.notes.filter((refNote) => {
                return refNote.noteInfo.noteID !== noteInfo.noteID;
            });
        } else {
            this.children
                .get(path[0])
                .removeNoteAtPath(osisRef, path.slice(1), noteInfo);
        }
    }
}

export class NotesTree extends NotesNode {
    constructor(id: string = 'root') {
        super(id);
    }

    addNote(osisRef: OSISRef, noteInfo: NoteInfo): boolean {
        var path = pathFromOSISRef(osisRef);
		return super.addNoteToPath(osisRef, path, noteInfo);
    }

    removeNoteAt(osisRef: OSISRef, noteInfo: NoteInfo): void {
        var path = pathFromOSISRef(osisRef);
        super.removeNoteAtPath(osisRef, path, noteInfo);
    }

    addNotes(osisRef: OSISRef, noteInfos: NoteInfo[]): void {
        for (var i in noteInfos) {
            this.addNote(osisRef, noteInfos[i]);
        }
    }

    notesCount(): number {
        return super.notesCount();
    }
}
