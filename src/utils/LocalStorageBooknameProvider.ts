'use strict';
import { BookNameProvider } from './BookNameProvider';

export class LocalStorageBooknameProvider implements BookNameProvider {

	lang : string;
	data : any;

	constructor(lang : string) {
		this.lang = lang;
		// TODO Need to do something if the file is not found.
		this.data = require(`./bible_locales/${lang}.json`);
	}

    getBookName(osisBookname: string): string {
        let hrBookName = this.data[osisBookname];
        if (hrBookName === undefined) {
            throw new Error(`Unknown bookname ${osisBookname} in language ${this.lang}`);
        }
        return hrBookName;
    }
}


