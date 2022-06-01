'use strict';

import { OSISRef, OSISRefType } from '../models/OSISRef';
import { BookNameProvider } from './BookNameProvider';

export class OSISRefRenderer {
    bookNameProvider: BookNameProvider;

    constructor(booknameProvider: BookNameProvider) {
        this.bookNameProvider = booknameProvider;
    }

    render(osisString: string): string {
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
                        resultString += this.bookNameProvider.getBookName(
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
                            this.render(osisRef.parts[0]) +
                            '-' +
                            this.render(osisRef.parts[1]);
                    }
                    return resultString;
                    break;

                case OSISRefType.SIMPLE:
                    let parts = osisRef.getElements();
                    let bookName = parts.bookName;
                    let chapter = parts.chapter;
                    let verse = parts.verse;
                    resultString += this.bookNameProvider.getBookName(bookName);

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
}
