import joplin from 'api';
import { render } from 'react-dom';
import { BibleNotesPanel } from './gui/BibleNotesPanel';
import {
    ClickNoteEvent,
    FetchDataEvent,
    GetSettingEvent,
    WebviewEvent,
    WebviewEventType,
} from './WebviewEvent';
import React = require('react');
import { PluginEvent, PluginEventType } from './PluginEvent';
import { NotesByOSISRef } from './FetchDataResult';
import { OSISRef } from './models/OSISRef';
import { Locales } from './i18n/i18n-types';

declare var webviewApi: any;
var gBibleNotesPanel: JSX.Element;
var noteUpdateFunc: Function;

function onPluginMessage(message) {
    var event: PluginEvent = message.message;
    switch (event.type) {
        case PluginEventType.NOTE_UPDATE:
            noteUpdateFunc();
            break;
        default:
            console.log('Unknown message -', event);
    }
}

// Recieving the message from the plugin.
webviewApi.onMessage(onPluginMessage);

/**
 *
 * @param id The id of the note which has been clicked.
 */
function noteClickCallback(noteId: string) {
    webviewApi.postMessage(new ClickNoteEvent(noteId));
}

async function pollLastChanged(): Promise<NotesByOSISRef> {
	return null;
}

async function fetchAllData(): Promise<NotesByOSISRef> {
    console.debug('Callback : Fetching all data');
    return webviewApi
        .postMessage(new FetchDataEvent('_all_'))
        .then((event: PluginEvent) => {
            if (event.type == PluginEventType.FETCH_RESULT) {
                var data = event.value.map((notesByOSISRef) => {
                    var p = new NotesByOSISRef(
                        new OSISRef(notesByOSISRef.osisRef.osisID),
                    );
                    notesByOSISRef.notes.forEach((noteInfo) => {
                        p.addNoteInfo(noteInfo.noteID, noteInfo.noteTitle);
                    });
                    return p;
                });
                return data;
            } else {
                console.debug('Got another response : ', event.value);
                throw Error('Unknown response');
            }
        });
}

function noteUpdateWrapper(f: Function) {
    noteUpdateFunc = f;
}

function createBibleNotesPanel(locale: Locales) {
    let hierarchyElement = document.getElementById('bible-hierarchy');

    // I do it like this because I am in a .ts file.
    gBibleNotesPanel = React.createElement(
        BibleNotesPanel,
        {
            locale: locale,
            fetchDataCallback: fetchAllData,
            noteClickCallback: noteClickCallback,
            noteUpdateWrapper: noteUpdateWrapper,
        },
        null,
    );
    render(gBibleNotesPanel, hierarchyElement);
}

function start() {
    webviewApi.postMessage(new GetSettingEvent('locale')).then(
        (locale) => {
			var l : Locales = locale.split('_')[0];
            createBibleNotesPanel(l);
        },

		// Defaulting to fr.
        () => {
            createBibleNotesPanel('fr');
        },
    );
}

start();
