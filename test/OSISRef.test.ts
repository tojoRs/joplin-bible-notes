const tap = require('tap');
import { OSISRef, OSISRefType } from '../src/models/OSISRef';

tap.test('OSISRef from JSON', (t) => {
    var ref1: OSISRef = OSISRef.fromJSON({ osisID: 'Gen.1.2' });
    t.match(
        ref1,
        { osisID: 'Gen.1.2', type: OSISRefType.SIMPLE },
        `OSISRef ${ref1.toString()} from JSON is good !!!`,
    );
    t.end();
});

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
