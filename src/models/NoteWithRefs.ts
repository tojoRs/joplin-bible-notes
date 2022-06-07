import { OSISRef } from './OSISRef';

export type OSISRefDiff = {
    added: OSISRef[];
    removed: OSISRef[];
};

export class NoteWithRefs {
    refs: OSISRef[];
    title: string;
    id: string;

    constructor(id: string, title: string, refs: OSISRef[]) {
        this.id = id;
        var orderedRefs: OSISRef[] = refs.sort((ref1, ref2) => {
            return ref1.compare(ref2);
        });
        this.refs = orderedRefs;
        this.title = title;
    }

    static fromJSON(o): NoteWithRefs {
        var refs: OSISRef[] = [];
        for (var i in o['refs']) {
			console.log(i);
            refs.push(OSISRef.fromJSON(o['refs'][i]));
        }
        return new NoteWithRefs(o['id'], o['title'], refs);
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
     * Returns the OSIS references that have been added from by the other object o,
     * and the OSISReferences that have been removed to the other object o.
     * @return An OSISRefDiff object.
     * */
    diffs(o: NoteWithRefs): OSISRefDiff {
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
        var diff: OSISRefDiff = this.diffs(o);
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
        return new TNoteWithRefs(o['id'], o['title'], refs, o['updatedTime']);
    }
}
