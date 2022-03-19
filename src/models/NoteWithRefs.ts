import { OSISRef } from './OSISRef';

export class NoteWithRefs {
    refs: OSISRef[];
    title: string;
    id: string;

    constructor(id: string, title: string, refs: OSISRef[]) {
        this.id = id;
        this.refs = [...refs];
        this.title = title;
    }

    static fromJSON(o): NoteWithRefs {
        var refs: OSISRef[] = [];
        for (var i in o['refs']) {
            refs.push(OSISRef.fromJSON(o['refs'][i]));
        }
        return new NoteWithRefs(o['id'], o['title'], refs);
    }

    addOSISRef(osisRef: OSISRef): void {
        if (this.refs.find((value, index, a) => {})) this.refs.push(osisRef);
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

    hasSameRefsAs(o: TNoteWithRefs): Boolean {
        // TODO
        return false;
    }
}
