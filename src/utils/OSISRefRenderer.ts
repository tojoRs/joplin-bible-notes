'use strict';

import { OSISRef, OSISRefType } from '../models/OSISRef';

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

export class OSISRefRenderer {
    static bookNameFromOSISName(lang: string, OSISName: string): string {
        let hrBookName = bookTables[lang][OSISName];
        if (hrBookName === undefined) {
            throw new Error(`Unknown bookname ${OSISName} in language ${lang}`);
        }
        return hrBookName;
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
                        resultString += OSISRefRenderer.bookNameFromOSISName(
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
                            OSISRefRenderer.getHumanReadableString(
                                lang,
                                osisRef.parts[0],
                            ) +
                            '-' +
                            OSISRefRenderer.getHumanReadableString(
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
                    resultString += OSISRefRenderer.bookNameFromOSISName(
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

    static render(osisString: string, locale: string): string {
        // TODO
        return '';
    }
}
