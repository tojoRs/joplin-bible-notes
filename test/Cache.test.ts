const tap = require('tap');

import { Cache } from '../src/Cache';
import { TNoteWithRefs } from '../src/models/NoteWithRefs';
import { OSISRef } from '../src/models/OSISRef';

import 'localstorage-polyfill';

tap.test('Tests for the cache system', (t) => {

	localStorage = global.localStorage;

    var n: TNoteWithRefs = new TNoteWithRefs(
        '1234-5678',
        'Note sur la Genèse',
        [new OSISRef('Gen.1.2')],
		1234
    );

    Cache.setNote(n.id, n);

    t.end();
});
