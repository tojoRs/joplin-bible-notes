const tap = require('tap');
import { OSISRef } from '../src/models/OSISRef';

tap.test(
    'OsisRef getHumanReadableString static function is working for french.',
    (t) => {
        t.equal(
            OSISRef.getHumanReadableString('fr', 'Matt.2.2'),
            'Matthieu 2,2',
            'Working for string book name chapter and verse',
        ),
            t.equal(
                OSISRef.getHumanReadableString('fr', 'Matt.2'),
                'Matthieu 2',
                'Working for string bookname chapter',
            ),
            t.equal(
                OSISRef.getHumanReadableString('fr', 'Matt'),
                'Matthieu',
                'Working for book only',
            ),
            t.equal(
                OSISRef.getHumanReadableString('fr', '1Chr.12.15'),
                '1 Chroniques 12,15',
                'Working for bookName with number and chapter, verse',
            ),
            t.equal(
                OSISRef.getHumanReadableString('fr', '1Chr.12'),
                '1 Chroniques 12',
                'Working for bookName with number and chapter',
            ),
            t.equal(
                OSISRef.getHumanReadableString('fr', '1Chr'),
                '1 Chroniques',
                'Working for bookName with number only',
            ),
            t.equal(
                OSISRef.getHumanReadableString('fr', 'Acts.1.5-1Cor.12.13'),
                'Actes des Apôtres 1,5-1 Corinthiens 12,13',
                'Working on book ranges',
            ),
            t.end();
    },
);

tap.test('OSISRef simple comparison.', (t) => {
    var t1: OSISRef = new OSISRef('Matt.1.1');
    var t2: OSISRef = new OSISRef('Matt.1.2');

    t.ok(t1.compare(t2) < 0, `{t1.toString()} is before {t2.toString()}`);
    t.ok(t2.compare(t1) > 0, `{t1.toString()} is still before {t2.toString()}`);

    t.ok(t1.compare(t1) == 0, '{t1.toString()} s equal to {t1.toString()}');

    t1 = new OSISRef('Gen.1');
    t2 = new OSISRef('Gen.2');
    t.ok(t1.compare(t2) < 0, `{t1.toString()} is before {t2.toString()}`);
    t.ok(t2.compare(t1) > 0, `{t1.toString()} is still before {t2.toString()}`);
    t.ok(t1.compare(t1) == +0, '{t1.toString()} s equal to {t1.toString()}');

    t1 = new OSISRef('Exod');
    t2 = new OSISRef('Mal');
    t.ok(t1.compare(t2) < 0, `{t1.toString()} is before {t2.toString()}`);
    t.ok(t2.compare(t1) > 0, `{t1.toString()} is still before {t2.toString()}`);
    t.ok(t1.compare(t1) == +0, '{t1.toString()} s equal to {t1.toString()}');

    // And a special case where there is one of the parts missing
    t1 = new OSISRef('Exod.1');
    t2 = new OSISRef('Mal');
    t.ok(t1.compare(t2) < 0, `{t1.toString()} is before {t2.toString()}`);
    t.ok(t2.compare(t1) > 0, `{t1.toString()} is still before {t2.toString()}`);
    t.ok(t1.compare(t1) == +0, '{t1.toString()} s equal to {t1.toString()}');

    // And a special case where there is one of the parts missing
    t1 = new OSISRef('Exod.1.2');
    t2 = new OSISRef('Exod.1');
    t.ok(t1.compare(t2) > 0, `{t2.toString()} is before {t1.toString()}`);
    t.ok(t2.compare(t1) < 0, `{t2.toString()} is still before {t1.toString()}`);
    t.end();
});

tap.test('OSISRef range comparison.', (t) => {
    var t1: OSISRef = new OSISRef('Matt.1.1-Matt.4.5');
    var t2: OSISRef = new OSISRef('Matt.1.2');

    t.ok(t1.compare(t2) < 0, `{t1.toString()} is before {t2.toString()}`);
    t.ok(t2.compare(t1) > 0, `{t1.toString()} is still before {t2.toString()}`);

	t1 = new OSISRef('Acts.1.5-1Cor.12.13');
	t2 = new OSISRef('Acts.1');
    t.ok(t1.compare(t2) > 0, `{t2.toString()} is before {t1.toString()}`);
    t.ok(t2.compare(t1) < 0, `{t2.toString()} is still before {t1.toString()}`);
    t.end();

});

