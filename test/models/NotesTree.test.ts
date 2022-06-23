'use strict';

const tap = require('tap');
import { NotesTree } from '../../src/models/NotesTree';
import { NoteInfo } from '../../src/models/NoteInfo';
import { OSISRef } from '../../src/models/OSISRef';

tap.test('Testing Basic Notes Tree functions', (t) => {
    var tree = new NotesTree();

    var note1 = { noteID: '123.111', noteTitle: 'Note 1' };
    var note2 = { noteID: '123.112', noteTitle: 'Note 2' };

    // Add the notes
    t.ok(tree.addNote(new OSISRef('Gen.1.2'), note1), 'Note correctly added');
	t.ok(tree.addNote(new OSISRef('Gen.1.2'), note2), 'Note correctly added');
	t.notOk(tree.addNote(new OSISRef('Gen.1.2'), note1), 'Note already inside the tree');

	t.same(tree.notesCount(), 2, 'Note count ok');

    var note3 = { noteID: '123.114', noteTitle: 'Note 3' };
    tree.addNote(new OSISRef('Matt.1.2'), note3);
	t.same(tree.notesCount(), 3, 'Note count ok');

    tree.removeNoteAt(new OSISRef('Gen.1.2'), note1);
	t.same(tree.notesCount(), 2, 'Note count ok');

    t.end();
});
