import joplin from 'api';
import { BibleNotes } from './BibleNotes';

joplin.plugins.register({
    onStart: async function () {
        await BibleNotes.init();
    },
});
