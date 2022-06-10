'use strict';
const tap = require('tap');

import { OSISRef } from '../../src/models/OSISRef';
import { pathFromOSISRef } from '../../src/models/OSISPath';

tap.test('OSIS path test', (t) => {
    var o1: OSISRef = new OSISRef('Matt.1.1');
    var p1: string[] = pathFromOSISRef(o1);
    t.match(
        p1,
        ['NT', 'Matt'],
        `OSISRef ${o1.toString()} path !!! ${p1}`,
    );

    var o2: OSISRef = new OSISRef('Gen.12.1');
    var p2: string[] = pathFromOSISRef(o2);
    t.match(
        p2,
        ['OT', 'Gen'],
        `OSISRef ${o2.toString()} path !!! ${p2}`,
    );

    // Ranges
    var o3: OSISRef = new OSISRef('Gen.12.1-Gen.12.4');
    var p3: string[] = pathFromOSISRef(o3);
    t.match(
        p3,
        ['OT', 'Gen'],
        `OSISRef ${o3.toString()} path !!! ${p3}`,
    );

    o1 = new OSISRef('Gen.12.1-Rev.4.2');
    p1 = pathFromOSISRef(o1);
    t.match(
        p1,
        [],
        `OSISRef ${o1.toString()} spanning on both old and new testaments`,
    );

    o1 = new OSISRef('Gen.12.1-Num.4.3');
    p1 = pathFromOSISRef(o1);
    t.match(p1, ['OT'], `OSISRef ${o1.toString()} in Old Testament`);

    o1 = new OSISRef('John.1.1-John.21.1');
    p1 = pathFromOSISRef(o1);
    t.match(p1, ['NT'], `OSISRef ${o1.toString()} in New Testament`);

    t.end();
});
