'use strict';

export interface BookNameProvider {
    getBookName(osisBookname: string): string;
}
