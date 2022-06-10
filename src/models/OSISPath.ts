'use strict'

import { OSISRef, OSISRefType } from './OSISRef';

export function pathFromOSISRef(osisRef : OSISRef) : string[] {
	// For now, only at book depth
	var path : string[] = [];
	switch(osisRef.type) {
		case OSISRefType.SIMPLE:
			if (osisRef.inOldTestament()) {
				path.push('OT');
			} else {
				path.push('NT');
			}
			path.push(osisRef.getElements()['bookName']);
			break;

		case OSISRefType.RANGE:
			var parts = osisRef.getElements();
			if (parts[0]['bookName'] == parts[1]['bookName']) {
				let bookName = parts[0]['bookName'];
				if (new OSISRef(bookName).inOldTestament()) {
					path.push('OT');
				} else {
					path.push('NT');
				}
				path.push(bookName);
			} else {
				// If the range is not spanning on both the old and new testament
				if (!(osisRef.inNewTestament() && osisRef.inNewTestament())) {
					if (osisRef.inNewTestament()) {
						path.push('NT');
					} else {
						path.push('OT');
					}
				}
			}
			break;
	}
	return path;
}
