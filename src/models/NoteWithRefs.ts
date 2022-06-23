import { OSISRef } from './OSISRef';
import { NoteInfo } from './NoteInfo';

export interface OSISRefOffset {
    added: OSISRef[];
    removed: OSISRef[];
};

export class NoteWithRefs implements NoteInfo {
    refs: OSISRef[];
    noteTitle: string;
    noteID: string;

    constructor(id: string, title: string, refs: OSISRef[]) {
        this.noteID = id;
        var orderedRefs: OSISRef[] = refs.sort((ref1, ref2) => {
            return ref1.compare(ref2);
        });
        this.refs = orderedRefs;
        this.noteTitle = title;
    }

    static fromJSON(o): NoteWithRefs {
        var refs: OSISRef[] = [];
        for (var i in o['refs']) {
            refs.push(OSISRef.fromJSON(o['refs'][i]));
        }
        return new NoteWithRefs(o['noteID'], o['noteTitle'], refs);
    }

    addOSISRef(osisRef: OSISRef): void {
        if (
            this.refs.find((value, index, a) => {
                return value.toString() === osisRef.toString();
            }) === undefined
        ) {
            this.refs.push(osisRef);
            this.refs.sort((ref1, ref2) => {
                return ref1.compare(ref2);
            });
        }
    }

	removeOSISRef(osisRef: OSISRef) : void {
		this.refs = this.refs.filter((ref) => {
			return osisRef.toString() !== ref.toString();
		});
	}

    /**
     * Returns the OSIS references that have been added to the other object o,
     * and the OSISReferences that have been removed to the other object o.
     * @return An OSISRefOffset object defining added and removed OSIS references
     * */
    offset(o: NoteWithRefs): OSISRefOffset {
        var added: OSISRef[];
        var removed: OSISRef[];

        const minus = (a: Array<OSISRef>, b: Array<OSISRef>) => {
            return a.filter((x) => b.indexOf(x) === -1);
        };

        added = minus(o.refs, this.refs);
        removed = minus(this.refs, o.refs);
        return { added: added, removed: removed };
    }

    hasSameRefsAs(o: NoteWithRefs): Boolean {
        var diff: OSISRefOffset = this.offset(o);
        return !diff.added.length && !diff.removed.length;
    }
}

export class TNoteWithRefs extends NoteWithRefs {
    updatedTime: number;

    constructor(
        id: string,
        title: string,
        refs: OSISRef[],
        updatedTime: number,
    ) {
        super(id, title, refs);
        this.updatedTime = updatedTime;
    }

    static fromJSON(o): TNoteWithRefs {
        var refs: OSISRef[] = [];
        for (var i in o['refs']) {
            refs.push(OSISRef.fromJSON(o['refs'][i]));
        }
        return new TNoteWithRefs(o['noteID'], o['noteTitle'], refs, o['updatedTime']);
    }
}
