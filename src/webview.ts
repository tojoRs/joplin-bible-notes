import { render } from "react-dom";
import { BibleHierarchy } from "./gui/BibleHierarchy";
import {
    ClickNoteEvent,
    FetchDataEvent,
    WebviewEvent,
    WebviewEventType,
} from "./WebviewEvent";
import React = require("react");
import { pathToFileURL } from "url";
import { PluginEvent, PluginEventType } from "./PluginEvent";
import { NotesByOSISRef } from "./FetchDataResult";
import { OSISRef } from "./models/OSISRef";
declare var webviewApi: any;
var gBibleHierarchy: JSX.Element;
var noteUpdateFunc: Function;

function onPluginMessage(message) {
	var event : PluginEvent = message.message;
	switch(event.type) {
		case PluginEventType.NOTE_UPDATE:
			console.log("Note Data - ", event.value);
			noteUpdateFunc();
			break;
		default:			
			console.log("Unknown message -", event);
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

async function fetchAllData(): Promise<NotesByOSISRef> {
    console.log("Callback : Fetching all data");
    return webviewApi
        .postMessage(new FetchDataEvent("_all_"))
        .then((event: PluginEvent) => {
            if (event.type == PluginEventType.FETCH_RESULT) {
                console.log("Got response : ", event.value);
                
                var data = event.value.map((notesByOSISRef) => {
                    var p = new NotesByOSISRef(
                        new OSISRef(notesByOSISRef.osisRef.osisID)
                    );
                    notesByOSISRef.notes.forEach((noteInfo) => {
                        p.addNoteInfo(noteInfo.noteID, noteInfo.noteTitle);
                    });
                    return p;
                });
                console.log("Rebuilt data : ", data);                
                return data;
            } else {
                console.log("Got another response : ", event.value);
                throw Error("Unknown response");
            }
        });
}

function noteUpdateWrapper(f : Function) {
	noteUpdateFunc = f;
}

function createBibleHierarchy() {
    let hierarchyElement = document.getElementById("bible-hierarchy");

    // I do it like this because I am in a .ts file.
    gBibleHierarchy = React.createElement(
        BibleHierarchy,
        {
            fetchDataCallback: fetchAllData,
            noteClickCallback: noteClickCallback,
			noteUpdateWrapper: noteUpdateWrapper,
        },
		null
    );
    render(gBibleHierarchy, hierarchyElement);
}

createBibleHierarchy();
