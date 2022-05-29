import * as React from 'react';
import { BibleHierarchy } from './BibleHierarchy';
import TypesafeI18n from '../i18n/i18n-react';
import { Locales } from '../i18n/i18n-types';

import { localStorageDetector } from 'typesafe-i18n/detectors';
import { loadLocale } from '../i18n/i18n-util.sync';

interface IBibleNotesPanelProps {
    locale: Locales;
    fetchDataCallback: Function;
    noteClickCallback: Function;
    noteUpdateWrapper: Function;
}

interface IBibleNotesPanelState {}

export class BibleNotesPanel extends React.Component<
    IBibleNotesPanelProps,
    IBibleNotesPanelState
> {
    constructor(props) {
        super(props);
        loadLocale(this.props.locale);
    }

    render() {
        return (
            <TypesafeI18n locale={this.props.locale}>
                <BibleHierarchy
                    fetchDataCallback={this.props.fetchDataCallback}
                    noteClickCallback={this.props.noteClickCallback}
                    noteUpdateWrapper={this.props.noteUpdateWrapper}
                />
            </TypesafeI18n>
        );
    }
}
