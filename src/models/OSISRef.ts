'use strict';

const canonicalOrder = [
    // First Testament
    'Gen',
    'Exod',
    'Lev',
    'Num',
    'Deut',
    'Josh',
    'Judg',
    'Ruth',
    '1Sam',
    '2Sam',
    '1Kgs',
    '2Kgs',
    '1Chr',
    '2Chr',
    'Ezra',
    'Neh',
    'Esth',
    'Job',
    'Ps',
    'Prov',
    'Eccl',
    'Song',
    'Isa',
    'Jer',
    'Lam',
    'Ezek',
    'Dan',
    'Hos',
    'Joel',
    'Amos',
    'Obad',
    'Jonah',
    'Mic',
    'Nah',
    'Hab',
    'Zeph',
    'Hag',
    'Zech',
    'Mal',

    // Apocryphes
    'Bar',
    'AddDan',
    'Bel',
    'SgThree',
    'Sus',
    '1Esd',
    '2Esd',
    'AddEsth',
    'EpJer',
    'Jdt',
    '1Macc',
    '2Macc',
    '3Macc',
    '4Macc',
    'PrMan',
    'Sir',
    'Tob',
    'Wis',

    // New Testament
    'Matt',
    'Mark',
    'Luke',
    'John',
    'Acts',
    'Rom',
    '1Cor',
    '2Cor',
    'Gal',
    'Eph',
    'Phil',
    'Col',
    '1Thess',
    '2Thess',
    '1Tim',
    '2Tim',
    'Titus',
    'Phlm',
    'Heb',
    'Jas',
    '1Pet',
    '2Pet',
    '1John',
    '2John',
    '3John',
    'Jude',
    'Rev',
];

export enum OSISRefType {
    SIMPLE,
    RANGE,
}

export class OSISRef {
	/**
	 * Contains the original OSIS string
	 * */	
    osisID: string;

	/**
	 * Contains 1 or 2 elements. It this OSISRef is a range, then 
	 * the first element is the beginning and the second element is the end
	 * */
    parts: string[];

    type: OSISRefType;

    static cv_separator: string = ',';

    constructor(osisID: string) {
        this.osisID = osisID;
        this.parts = osisID.split('-');
        if (this.parts[1] === undefined) {
            this.type = OSISRefType.SIMPLE;
        } else {
            this.type = OSISRefType.RANGE;
        }
    }

    compare(o: OSISRef): number {
        // Get the first of both
        var beginThis, beginO: OSISRef;
        var endThis, endO: OSISRef;

        if (this.type == OSISRefType.SIMPLE) {
            beginThis = this;
            endThis = this;
        } else {
            beginThis = new OSISRef(this.parts[0]);
            endThis = new OSISRef(this.parts[1]);
        }

        if (o.type == OSISRefType.SIMPLE) {
            beginO = o;
            endO = o;
        } else {
            beginO = new OSISRef(o.parts[0]);
            endO = new OSISRef(o.parts[1]);
        }

        let beginD = OSISRef.compareSimpleRefString(
            beginThis.osisID,
            beginO.osisID,
        );
        if (beginD == 0) {
            return OSISRef.compareSimpleRefString(endThis.osisID, endO.osisID);
        } else {
            return beginD;
        }
    }

    /**
     * Compares two OSIS references.
     * This function works iff the book name is define in both strings.
     * @param An OSIS Reference
     * @param An OSIS Reference
     * @returns Returns a positive number if osisRef1 is before osisRef2, a negative number is osisRef1 is after osisRef2 and 0 if they are equal
     * */
    static compareSimpleRefString(
        osisString1: string,
        osisString2: string,
    ): number {
        let osisRef1 = new OSISRef(osisString1);
        let osisRef2 = new OSISRef(osisString2);

        let parts1 = osisRef1.getElements();
        let parts2 = osisRef2.getElements();

        // Replace undefined parts with 0;
        var replaceUndefined = (d) => {
            for (var m in d) {
                if (d[m] === undefined) {
                    d[m] = 0;
                }
            }
            return d;
        };
        parts1 = replaceUndefined(parts1);
        parts2 = replaceUndefined(parts2);

        if (parts1.bookName == parts2.bookName) {
            if (parts1.chapter == parts2.chapter) {
                if (parts1.verse == parts2.verse) {
                    return 0;
                }
                return parseInt(parts1.verse, 10) - parseInt(parts2.verse, 10);
            }
            return parseInt(parts1.chapter, 10) - parseInt(parts2.chapter, 10);
        }
        // For now, only canonical order.
        return (
            canonicalOrder.indexOf(parts1.bookName) -
            canonicalOrder.indexOf(parts2.bookName)
        );
    }

    getElements(): any {
        var splitParts = (s) => {
            let regex = /^([^.]+)(?:\.(\d+)(?:\.(\d+))?)?$/;
            let matchResult = s.match(regex);
            let bookName = matchResult[1];
            let chapter = matchResult[2];
            let verse = matchResult[3];

            return { bookName: bookName, chapter: chapter, verse: verse };
        };

        switch (this.type) {
            case OSISRefType.SIMPLE:
                return splitParts(this.parts[0]);

            case OSISRefType.RANGE:
                return [splitParts(this.parts[0]), splitParts(this.parts[1])];
        }
    }

    isEqual(osisRef: OSISRef): boolean {
        return osisRef.osisID == this.osisID;
    }

	inOldTestament() : boolean {
		// If the reference is before the Gospel of Matthew, then it is in the Old Testament.
		if (this.type == OSISRefType.SIMPLE) {
			return OSISRef.compareSimpleRefString(this.osisID, "Matt") < 0;
		} else {
			// This is a RANGE
			return OSISRef.compareSimpleRefString(this.parts[0], "Matt") < 0;
		}
	}

	inNewTestament() : boolean {
		if (this.type == OSISRefType.SIMPLE) {
			return !this.inOldTestament();
		} else {
			// This is a RANGE
			let end = new OSISRef(this.parts[1]);
			return !end.inOldTestament();
		}
	}

    static isValidOSISRef(s: string): boolean {
        // TODO
        return true;
    }

    toString(): string {
        return this.osisID;
    }

    static fromJSON(json): OSISRef {
        return new OSISRef(json['osisID']);
    }
}
