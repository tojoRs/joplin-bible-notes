'use strict';
const tap = require('tap');
import { OSISRefRenderer } from '../../src/utils/OSISRefRenderer';

tap.test(
    'OsisRefRenderer getHumanReadableString static function is working for french.',
    (t) => {
        t.equal(
            OSISRefRenderer.getHumanReadableString('fr', 'Matt.2.2'),
            'Matthieu 2,2',
            'Working for string book name chapter and verse',
        ),
            t.equal(
                OSISRefRenderer.getHumanReadableString('fr', 'Matt.2'),
                'Matthieu 2',
                'Working for string bookname chapter',
            ),
            t.equal(
                OSISRefRenderer.getHumanReadableString('fr', 'Matt'),
                'Matthieu',
                'Working for book only',
            ),
            t.equal(
                OSISRefRenderer.getHumanReadableString('fr', '1Chr.12.15'),
                '1 Chroniques 12,15',
                'Working for bookName with number and chapter, verse',
            ),
            t.equal(
                OSISRefRenderer.getHumanReadableString('fr', '1Chr.12'),
                '1 Chroniques 12',
                'Working for bookName with number and chapter',
            ),
            t.equal(
                OSISRefRenderer.getHumanReadableString('fr', '1Chr'),
                '1 Chroniques',
                'Working for bookName with number only',
            ),
            t.equal(
                OSISRefRenderer.getHumanReadableString('fr', 'Acts.1.5-1Cor.12.13'),
                'Actes des Apôtres 1,5-1 Corinthiens 12,13',
                'Working on book ranges',
            ),
            t.end();
    },
);
