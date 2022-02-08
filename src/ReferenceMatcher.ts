import { OSISRef } from './models/OSISRef';
const bcv_parser =
    require('bible-passage-reference-parser/js/fr_bcv_parser.js').bcv_parser;

export namespace ReferenceMatcher {
    /**
     * A parser Singleton
     * */
    var BCVParserSingleton = (function () {
        var bcv_parserInstance;

        function createInstance() {
            bcv_parserInstance = new bcv_parser();

            bcv_parserInstance.set_options({
                punctuation_strategy: 'eu',
                sequence_combination_strategy: 'separate',
            });
            return bcv_parserInstance;
        }

        return {
            getInstance: function () {
                if (!bcv_parserInstance) {
                    bcv_parserInstance = createInstance();
                }
                return bcv_parserInstance;
            },
        };
    })();

    /**
     * Returns the references in a Note.
     * For now, it uses openbibleinfo/bible-passage-reference-parser. Thanks to the author !
     * @param text The text to be scanned for matches. The text can be multilines.
     * @returns An array of the OSIS references found in the given text.
     */
    export function matchReferences(text: string): OSISRef[] {
        var bcv = BCVParserSingleton.getInstance();
        const result = bcv.parse(text).osis();
        if (result.length === 0) {
            // Nothing else to do
            return [];
        }

        const osis_references = result.split(',');
        return osis_references.map((or) => new OSISRef(or));
    }

    /**
     * Retrieve only unique references
     * @param refs An array of Osis references
     * @returns An array which do not contain duplicate references
     */
    export function uniqueReferences(refs: OSISRef[]): OSISRef[] {
        var removeDuplicateReferences = function (array: OSISRef[]) {
            const flag = {};
            const unique = [];
            array.forEach((element) => {
                if (!flag[element.toString()]) {
                    flag[element.toString()] = true;
                    unique.push(element);
                }
            });
            return unique;
        };
        const unique = removeDuplicateReferences(refs);
        return unique;
    }
}
