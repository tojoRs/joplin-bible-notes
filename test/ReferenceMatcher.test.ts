const tap = require('tap');
import { OSISRef } from '../src/models/OSISRef';
import { ReferenceMatcher } from '../src/ReferenceMatcher';

tap.test('Tests for ReferenceMatcher', (t) => {
    t.same(ReferenceMatcher.matchReferences('Hello !!!'), []);

    t.same(ReferenceMatcher.matchReferences('Luc 1,2'), [
        new OSISRef('Luke.1.2'),
    ]);

    t.same(
        ReferenceMatcher.matchReferences(
            'Nous voyons cela par exemple dans Luc 1,2.',
        ),
        [new OSISRef('Luke.1.2')],
    );

    t.same(
        ReferenceMatcher.matchReferences(
            'Dans le sermon de Jésus, Matthieu 5, en 1 Corinthiens 4',
        ),
        [new OSISRef('Matt.5'), new OSISRef('1Cor.4')],
    );

    t.same(
        ReferenceMatcher.matchReferences(
            'Dans le sermon de Jésus, Matthieu 5, Matthieu 7, en 1 Corinthiens 4',
        ),
        [new OSISRef('Matt.5'), new OSISRef('Matt.7'), new OSISRef('1Cor.4')],
    );

    t.same(
        ReferenceMatcher.matchReferences(
            'Nous allons dans le récit de la Création, puis la chute Gen 1; Gen 3.',
        ),
        [new OSISRef('Gen.1'), new OSISRef('Gen.3')],
    );

    t.end();
});
