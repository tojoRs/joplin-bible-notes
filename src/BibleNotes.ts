import joplin from 'api';
import { settings } from './settings';
import { ToolbarButtonLocation } from 'api/types';
import { OSISRef } from './models/OSISRef';

import { ClickNoteEvent, WebviewEventType } from './WebviewEvent';
import { PluginEvent, PluginEventType } from './PluginEvent';
import { NotesByOSISRef } from './FetchDataResult';
import { disconnect } from 'process';
import { ReferenceMatcher } from './ReferenceMatcher';
import { resolve } from 'path';
import JoplinSettings from 'api/JoplinSettings';

/**
 *
 */
export namespace BibleNotes {
    /**
     * Create the mail plugin panel.
     * @returns
     */
    async function createPanel(): Promise<string> {
        const panel = await joplin.views.panels.create('biblenotes_panel');
        await joplin.views.panels.setHtml(
            panel,
            `<div class="container">
                <div class="panel" id="bible-hierarchy">Loading...</div>
            </div>`,
        );
        await joplin.views.panels.addScript(panel, './webview.js');
        await joplin.views.panels.addScript(panel, './webview.css');

        joplin.views.panels.onMessage(panel, async (event) => {
            switch (event.type) {
                case WebviewEventType.CLICK_NOTE:
                    // Open the selected note.
                    joplin.commands.execute('openNote', event.noteId);
                    break;

                case WebviewEventType.FETCH_DATA:
                    // Fetch the corresponding data either from the database or directly by scanning the notes.
                    console.log(
                        'Plugin received event FETCH_DATA : ' + event.query,
                    );

                    var notesByOSISRef = await prepareQueryResults(event.query);
                    var resultEvent = new PluginEvent(
                        PluginEventType.FETCH_RESULT,
                    );
                    resultEvent.value = notesByOSISRef;
                    return resultEvent;

                case WebviewEventType.ACCEPT_RESPONSE:
                    console.log('Webview is ready to listen');
                    break;

                default:
                    console.log('Unhandled message ' + event);
            }
        });

        return panel;
    }

    /**
     * Register settings
     */
    async function setupSettings(): Promise<void> {
        await settings.register();

        // init settings value
        await updateSetting('lang');

        joplin.settings.onChange(async (event: any) => {
            await BibleNotes.settingsChanged(event);
        });
    }

    async function setupCommands(panel: string): Promise<void> {
        await joplin.commands.register({
            name: 'toggleBibleNotes',
            label: 'Toggle Bible Notes',
            iconName: 'fas fa-drum',
            execute: async () => {
                const isVisible = await joplin.views.panels.visible(panel);
                await joplin.views.panels.show(panel, !isVisible);
            },
        });
    }

    async function setupControls(): Promise<void> {
        await joplin.views.toolbarButtons.create(
            'toggleBibleNotes',
            'toggleBibleNotes',
            ToolbarButtonLocation.NoteToolbar,
        );
    }

    /**
     * I should find a way here to check whether I need to scan all the notes at startup or not.
     * Some dialog box.
     */
    export async function init() {
        console.info('Bible Notes plugin started!');
        const panel = await createPanel();
        await setupSettings();
        await setupCommands(panel);
        await setupControls();
        await updatePanelData();
        // await connectNoteChangedCallback(updatePanelData);
    }

    export async function updatePanelData() {
        // TODO
        console.info('Webview updated');
        await getNotesWithRefs();
    }

    export async function settingsChanged(event: any) {
        for (let key of event.keys) {
            await updateSetting(key);
        }
    }

    /**
     * Updates the setting into the local storage.
     * @param setting The setting name
     */
    export async function updateSetting(setting) {
        localStorage.setItem(setting, await joplin.settings.value(setting));
    }

    async function getAllNoteTitles(): Promise<any> {
        const titles = await joplin.data.get(['notes'], { fields: ['title'] });
        return titles;
    }

    class NoteWithRefs {
        refs: OSISRef[];
        title: string;
        id: string;

        constructor(id: string, title: string, refs: OSISRef[]) {
            this.id = id;
            this.refs = refs;
            this.title = title;
        }

        addOSISRef(osisRef: OSISRef): void {
            if (this.refs.find((value, index, a) => {}))
                this.refs.push(osisRef);
        }
    }

    async function prepareQueryResults(query): Promise<NotesByOSISRef[]> {
        var notesWithRefs = await getNotesWithRefs();
        var resultDict = {};

        notesWithRefs.forEach((noteWithRefs, index, array) => {
            var refs = noteWithRefs.refs;
            refs.forEach((r, i, a) => {
                const refString = r.toString();
                if (refString in resultDict) {
                    var n: NotesByOSISRef = resultDict[refString];
                    if (!n.hasNote(noteWithRefs.id)) {
                        n.addNoteInfo(noteWithRefs.id, noteWithRefs.title);
                    }
                } else {
                    resultDict[refString] = new NotesByOSISRef(r);
                    resultDict[refString].addNoteInfo(
                        noteWithRefs.id,
                        noteWithRefs.title,
                    );
                }
            });
        });

        return Object.keys(resultDict).map((key) => {
            return resultDict[key];
        });
    }

    async function getNotesWithRefs(): Promise<NoteWithRefs[]> {
        // for each note in notes
        let notesWithRefs: NoteWithRefs[] = [];
        let pageNum = 1; // The start defaults to 1 according to the API documentation.
        do {
            var response = await joplin.data.get(['notes'], {
                fields: ['id', 'title', 'body'],
                page: pageNum++,
            });
            response.items.forEach((note, _index, _array) => {
                var refs = ReferenceMatcher.matchReferences(
                    note['body'],
                ).concat(ReferenceMatcher.matchReferences(note['title']));
                var finalRefs = ReferenceMatcher.uniqueReferences(refs);

                if (finalRefs.length > 0) {
                    notesWithRefs.push(
                        new NoteWithRefs(note['id'], note['title'], finalRefs),
                    );
                }
            });
        } while (response.has_more);
        return notesWithRefs;
    }
}
