'use strict';
const tap = require('tap');
import { OSISRefRenderer } from '../../src/utils/OSISRefRenderer';

import { loadLocale } from '../../src/i18n/i18n-util.sync';
import { i18nObject } from '../../src/i18n/i18n-util';

tap.test('OsisRefRenderer render function is working for french.', (t) => {
    loadLocale('fr');
    var LL = i18nObject('fr');
    let osisRefRenderer = new OSISRefRenderer({
        getBookName: (bookName) => {
            return LL[bookName]();
        },
    });

    t.equal(
        osisRefRenderer.render('Matt.2.2'),
        'Matthieu 2,2',
        'Working for string book name chapter and verse',
    ),
        t.equal(
            osisRefRenderer.render('Matt.2'),
            'Matthieu 2',
            'Working for string bookname chapter',
        ),
        t.equal(
            osisRefRenderer.render('Matt'),
            'Matthieu',
            'Working for book only',
        ),
        t.equal(
            osisRefRenderer.render('1Chr.12.15'),
            '1 Chroniques 12,15',
            'Working for bookName with number and chapter, verse',
        ),
        t.equal(
            osisRefRenderer.render('1Chr.12'),
            '1 Chroniques 12',
            'Working for bookName with number and chapter',
        ),
        t.equal(
            osisRefRenderer.render('1Chr'),
            '1 Chroniques',
            'Working for bookName with number only',
        ),
        t.equal(
            osisRefRenderer.render('Acts.1.5-1Cor.12.13'),
            'Actes des Apôtres 1,5-1 Corinthiens 12,13',
            'Working on book ranges',
        ),
        t.end();
});
