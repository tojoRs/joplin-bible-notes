'use strict';

import { OSISRef, OSISRefType } from './OSISRef';
import { BIBLE_STRUCTURE_NO_DEUTERO } from './BibleStructures';

function structure_find(id: string, structure): number[] {
    let l = structure.length;
    let i: number = 0;
    let found: boolean = false;
    let res: number[] = [-1];

    while (!found && i < l) {
        if (Array.isArray(structure[i])) {
            res = structure_find(id, structure[i]);
            if (res[0] > -1) {
                found = true;
                res = [i].concat(res);
            }
        } else {
            res[0] = structure.indexOf(id);
            if (res[0] > -1) {
                found = true;
            }
        }
        i = i + 1;
    }
    return res;
}

export function pathFromStructure(osisRef: OSISRef, structure: any): string[] {
    var path: string[] = [];
    var level = structure.length;

    const extract = function (substructure: [], ids: Array<number>): string {
        if (ids.length > 1) {
            return extract(substructure[ids[0]], ids.slice(1));
        } else {
            return substructure[ids[0]];
        }
    };

    switch (osisRef.type) {
        case OSISRefType.SIMPLE:
            let bookName = osisRef.getElements()['bookName'];

            // Search at the lowest level
            let path_ids = structure_find(bookName, structure[level - 1]);

            console.log('bookName = ', bookName, 'path_ids = ', path_ids);

            if (path_ids[0] > -1) {
                for (let i = 0; i < path_ids.length; ++i) {
                    path.push(extract(structure[i], path_ids.slice(0, i + 1)));
                }
            } else {
                throw new Error(`Path to ${bookName} not found`);
            }

            // TODO Have to trim path...

            break;

        case OSISRefType.RANGE:
            let path_start: string[] = [];
            let path_end: string[] = [];

            // Get both paths and take the elements until they differ.
            path_start = pathFromStructure(
                new OSISRef(osisRef.parts[0]),
                structure,
            );
            path_end = pathFromStructure(
                new OSISRef(osisRef.parts[1]),
                structure,
            );
            let i = 0;

            while (
                i < path_start.length &&
                i < path_end.length &&
                path_start[i] === path_end[i]
            ) {
                path.push(path_start[i]);
                i++;
            }

            break;
    }
    return path;
}

export function pathFromOSISRef(osisRef: OSISRef): string[] {
    return pathFromStructure(osisRef, BIBLE_STRUCTURE_NO_DEUTERO);
}

