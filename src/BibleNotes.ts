import joplin from 'api';
import { settings } from './settings';
import { ToolbarButtonLocation } from 'api/types';
import { OSISRef } from './models/OSISRef';
import { NoteWithRefs, TNoteWithRefs } from './models/NoteWithRefs';

import { ClickNoteEvent, WebviewEventType } from './WebviewEvent';
import { PluginEvent, PluginEventType, NoteUpdateEvent } from './PluginEvent';
import { NotesByOSISRef } from './FetchDataResult';
import JoplinSettings from 'api/JoplinSettings';
import { RefsNotesDB } from './RefsNotesDB';

/**
 * Main namespace for the BibleNotes plugin
 */
export namespace BibleNotes {
    var gRefsNotesDB: RefsNotesDB;

    /**
     * Create the main plugin panel.
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

                    var notesByOSISRef = [];
                    if (event.query == '_all_') {
                        notesByOSISRef = gRefsNotesDB.getNotesForOSISRef('');
                    } else {
                        notesByOSISRef = gRefsNotesDB.getNotesForOSISRef(
                            event.query,
                        );
                    }
                    var resultEvent = new PluginEvent(
                        PluginEventType.FETCH_RESULT,
                    );
                    resultEvent.value = notesByOSISRef;
                    return resultEvent;

                case WebviewEventType.ACCEPT_RESPONSE:
                    console.log('Webview is ready to listen');
                    break;

                case WebviewEventType.GET_SETTING:
                    console.log('Get setting event', event.setting);
					if (event.setting === "locale") {
						return joplin.settings.globalValue(event.setting);
					} else {
						// Unknown setting
						return;
					}

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

        joplin.settings.onChange(async (event: any) => {
            await BibleNotes.settingsChanged(event);
        });
    }

    async function setupCommands(panel: string): Promise<void> {
        await joplin.commands.register({
            name: 'toggleBibleNotes',
            label: 'Toggle Bible Notes',
            iconName: 'fas fa-bible',
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

    function updatePanelOnNoteChange(panel) {
        return async (event: any) => {
            var changed = await gRefsNotesDB.updateNote(event.id);
            if (changed) {
                joplin.views.panels.postMessage(
                    panel,
                    new NoteUpdateEvent(event.id),
                );
            }
        };
    }

    /**
     * I should find a way here to check whether I need to scan all the notes at startup or not.
     * Some dialog box.
     */
    export async function init() {
        console.info('Bible Notes plugin started!');
        gRefsNotesDB = new RefsNotesDB();
        const panel = await createPanel();
        joplin.workspace.onNoteChange(updatePanelOnNoteChange(panel));

        await setupSettings();
        await setupCommands(panel);
        await setupControls();

        // Send settings to the webview
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
}
