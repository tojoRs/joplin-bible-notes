const tap = require('tap');
import { OSISRef } from '../../src/models/OSISRef';
import { NoteWithRefs } from '../../src/models/NoteWithRefs';

tap.test('NoteWithRefs from JSON tests', (t) => {
    var n1 = NoteWithRefs.fromJSON({
        noteID: '121212',
        noteTitle: 'Note de test',
        refs: [{ osisID: 'Gen.1.2' }],
    });

    t.hasProps(n1, ['noteID', 'noteTitle', 'refs'], 'NoteWithRefs n1 has properties');
    t.match(
        n1,
        { noteID: '121212', noteTitle: 'Note de test', refs: [{ osisID: 'Gen.1.2' }] },
        'NoteWithRefs n1 has properties and they match',
    );

    t.end();
});

tap.test('NoteWithRefs references tests.', (t) => {
    var o1: OSISRef = new OSISRef('Matt.1.1');
    var o2: OSISRef = new OSISRef('Matt.2.6');
    var o3: OSISRef = new OSISRef('Gen.4.2');

    var n1 = new NoteWithRefs('121212', 'Note de test', [o1, o2, o3]);
    var n2 = new NoteWithRefs('121214', 'Note de test 2', [o1, o2]);
    var n3 = new NoteWithRefs('121215', 'Note de test 3', [o2, o1, o3]);

    t.notOk(n1.hasSameRefsAs(n2), `n1 has not same refs as n2`);
    t.notOk(n2.hasSameRefsAs(n1), `n2 has not same refs as n1`);
    t.ok(n1.hasSameRefsAs(n3), `n1 has same refs as n3`);

    // Then adding and comparing
    n2.addOSISRef(o1);
    n2.addOSISRef(o3);
    t.ok(n1.hasSameRefsAs(n2), `n1 has same refs as n2`);

    n2.addOSISRef(new OSISRef('1Cor.2.1'));
    t.notOk(n1.hasSameRefsAs(n2), `n1 has same refs as n2`);

    // Then remove
    n2.removeOSISRef(new OSISRef('1Cor.2.1'));
    t.ok(n1.hasSameRefsAs(n2), `n1 has again not the same refs as n2`);

    t.end();
});
