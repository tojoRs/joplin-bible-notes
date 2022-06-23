'use strict';

import { NoteInfo } from './NoteInfo';
import { OSISRef } from './OSISRef';

export type NoteStateOffset = {
    noteInfo: NoteInfo;
    removed: OSISRef[];
    added: OSISRef[];
};
