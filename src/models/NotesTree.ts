'use strict';

import { NoteInfo } from './NoteInfo';
import { OSISRef } from './OSISRef';
import { pathFromOSISRef } from './OSISPath';

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

    addNoteToPath(osisRef: OSISRef, path: string[], noteInfo: NoteInfo) {
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
            }
        } else {
            if (this.children.has(path[0])) {
                this.children
                    .get(path[0])
                    .addNoteToPath(osisRef, path.slice(1), noteInfo);
            } else {
                let child = new NotesNode(path[0]);
                child.addNoteToPath(osisRef, path.slice(1), noteInfo);

                // Place 'NT' after 'OT'
                if (path[0] == 'OT' && this.children.size > 0) {
                    // Get the already existing 'NT' node
                    if (this.children.size > 1) {
                        throw new Error(
                            'There are more Bible sections than expected',
                        );
                    }

                    var ntNode = this.children.get('NT');
                    this.children = new Map<string, NotesNode>();
                    this.children.set(path[0], child);
                    this.children.set('NT', ntNode);
                } else {
                    this.children.set(path[0], child);
                }
            }
        }
    }
}

export class NotesTree extends NotesNode {
    constructor(id: string = 'root') {
        super(id);
    }

    addNote(osisRef: OSISRef, noteInfo: NoteInfo): void {
        var path = pathFromOSISRef(osisRef);
        this.addNoteToPath(osisRef, path, noteInfo);
    }

    addNotes(osisRef: OSISRef, noteInfos: NoteInfo[]): void {
        var path = pathFromOSISRef(osisRef);
        for (var i in noteInfos) {
            this.addNoteToPath(osisRef, path, noteInfos[i]);
        }
    }

    notesCount(): number {
        return super.notesCount();
    }
}
