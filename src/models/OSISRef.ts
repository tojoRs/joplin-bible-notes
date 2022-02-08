//'use strict';

const bookTables = {
    fr: {
        Gen: 'Genèse',
        Exod: 'Exode',
        Lev: 'Lévitique',
        Num: 'Nombres',
        Deut: 'Deutéronome',
        Josh: 'Josué',
        Judg: 'Juges',
        Ruth: 'Ruth',
        '1Sam': '1 Samuel',
        '2Sam': '2 Samuel',
        '1Kgs': '1 Rois',
        '2Kgs': '2 Rois',
        '1Chr': '1 Chroniques',
        '2Chr': '2 Chroniques',
        Ezra: 'Esdras',
        Neh: 'Néhémie',
        Esth: 'Esther',
        Job: 'Job',
        Ps: 'Psaumes',
        Prov: 'Proverbes',
        Eccl: 'Ecclésiaste',
        Song: 'Cantique des Cantiques',
        Isa: 'Esaie',
        Jer: 'Jérémie',
        Lam: 'Lamentations de Jérémie',
        Ezek: 'Ezechiel',
        Dan: 'Daniel',
        Hos: 'Osée',
        Joel: 'Joël',
        Amos: 'Amos',
        Obad: 'Abdias',
        Jonah: 'Jonas',
        Mic: 'Michée',
        Nah: 'Nahum',
        Hab: 'Habacuc',
        Zeph: 'Sophonie',
        Hag: 'Aggée',
        Zech: 'Zacharie',
        Mal: 'Malachie',
        Bar: 'Baruch',
        AddDan: 'Ajouts à Daniel',
        Bel: 'Bel et le Dragon',
        SgThree: 'Cantique des trois enfants',
        Sus: 'Suzanne',
        '1Esd': '1 Esdras',
        '2Esd': '2 Esdras',
        AddEsth: 'Esther grec',
        EpJer: 'Lettre de Jérémie',
        Jdt: 'Judith',
        '1Macc': '1 Macchabées',
        '2Macc': '2 Macchabées',
        '3Macc': '3 Macchabées',
        '4Macc': '4 Maccabées',
        PrMan: 'Manasseh',
        Sir: 'Siracide',
        Tob: 'Tobit',
        Wis: 'Sagesse',
        Matt: 'Matthieu',
        Mark: 'Marc',
        Luke: 'Luc',
        John: 'Jean',
        Acts: 'Actes des Apôtres',
        Rom: 'Romains',
        '1Cor': '1 Corinthiens',
        '2Cor': '2 Corinthiens',
        Gal: 'Galates',
        Eph: 'Ephésiens',
        Phil: 'Philippiens',
        Col: 'Colossiens',
        '1Thess': '1 Thessaloniciens',
        '2Thess': '2 Thessaloniciens',
        '1Tim': '1 Timothée',
        '2Tim': '2 Timothée',
        Titus: 'Tite',
        Phlm: 'Philémon',
        Heb: 'Hébreux',
        Jas: 'Jacques',
        '1Pet': '1 Pierre',
        '2Pet': '2 Pierre',
        '1John': '1 Jean',
        '2John': '2 Jean',
        '3John': '3 Jean',
        Jude: 'Jude',
        Rev: 'Apocalypse',
    },

    en: {
        Gen: 'Genesis',
    },
};

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
    osisID: string;
    parts: string[];
    type: OSISRefType;

    static cv_separator: string = ',';

    constructor(osisID) {
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

    static bookNameFromOSISName(lang: string, OSISName: string): string {
        let hrBookName = bookTables[lang][OSISName];
        if (hrBookName === undefined) {
            throw new Error(`Unknown bookname ${OSISName} in language ${lang}`);
        }
        return hrBookName;
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

    static getHumanReadableString(lang: string, osisString: string): string {
        let osisRef = new OSISRef(osisString);
        let resultString = '';
        try {
            switch (osisRef.type) {
                case OSISRefType.RANGE:
                    let [begin, end] = osisRef.getElements();

                    // Ensure it's really a range...
                    //// ... Instructions.
                    //
                    if (begin.bookName == end.bookName) {
                        // The books are the same
                        resultString += OSISRef.bookNameFromOSISName(
                            lang,
                            begin.bookName,
                        );
                        if (begin.chapter == end.chapter) {
                            // The chapters are the same, so the verses must be different
                            // Then we go down to verse level
                            // When we arrive here, there should be verses
                            // and the two verses should be different
                            resultString += ` ${begin.chapter}${OSISRef.cv_separator}${begin.verse}-${end.verse}`;
                        } else {
                            // The chapters are not the same
                            // So we need to go down one more level.
                            if (begin.verse === undefined) {
                                resultString += ` ${begin.chapter}-${end.chapter}`;
                            } else {
                                resultString += ` ${begin.chapter}${OSISRef.cv_separator}${begin.verse}-\
								${end.chapter}${OSISRef.cv_separator}${end.verse}`;
                            }
                        }
                    } else {
                        // The books are not the same
                        resultString =
                            OSISRef.getHumanReadableString(
                                lang,
                                osisRef.parts[0],
                            ) +
                            '-' +
                            OSISRef.getHumanReadableString(
                                lang,
                                osisRef.parts[1],
                            );
                    }
                    return resultString;
                    break;

                case OSISRefType.SIMPLE:
                    let parts = osisRef.getElements();
                    let bookName = parts.bookName;
                    let chapter = parts.chapter;
                    let verse = parts.verse;
                    resultString += OSISRef.bookNameFromOSISName(
                        lang,
                        bookName,
                    );

                    if (chapter !== undefined) {
                        resultString += ' ' + chapter;

                        if (verse !== undefined) {
                            resultString += OSISRef.cv_separator + verse;
                        }
                    }
                    return resultString;
            }
        } catch (e) {
            console.log(
                `Error on finding human readable name for string ${osisString}`,
            );
        } finally {
            return resultString;
        }
    } // end

    isEqual(osisRef: OSISRef): boolean {
        return osisRef.osisID == this.osisID;
    }

    static isValidOSISRef(s: string): boolean {
        // TODO
        return true;
    }

    toString(): string {
        return this.osisID;
    }

    getHumanReadableString(lang): string {
        return OSISRef.getHumanReadableString(lang, this.osisID);
    }
}
