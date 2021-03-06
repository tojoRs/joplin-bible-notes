import * as React from 'react';
import { NoteInfo } from '../models/NoteInfo';
import { OSISRef } from '../models/OSISRef';
import { NoteWithRefs } from '../models/NoteWithRefs';
import { OSISRefRenderer } from '../utils/OSISRefRenderer';
import { I18nContext } from '../i18n/i18n-react';
import { NotesNode } from '../models/NotesTree';
import { NotesTreeStore } from '../models/NotesTreeStore';

const styled = require('styled-components').default;

import {
    ExpandIcon,
    StyledItemHeader,
    StyledNoteAnchor,
    StyledNoteItem,
    StyledRoot,
    StyledSection,
    StyledTitle,
} from './StyledElements';

interface ISectionProps {
    id: string;
    notesNode?: NotesNode;
    height?: number;
    level: number;
    isExpanded?: boolean;
    fetchDataCallback: Function;
    noteClickCallback: Function;
}

interface ISectionState {
    isExpanded?: boolean;
    height?: number;
}

interface INoteProps {
    noteInfo: NoteInfo;
    osisRef: OSISRef;
    noteClickCallback: Function;
}

interface IBibleHierarchyProps {
    rootHeight?: number;
    fetchDataCallback: Function;
    noteClickCallback: Function;
    noteUpdateWrapper: Function;
    notes?: NoteWithRefs[];
}

interface IBibleHierarchyState {
    notesTree: NotesTreeStore;
    rootHeight?: number;
}

export class NoteItem extends React.Component<INoteProps> {
    static contextType = I18nContext;

    constructor(props) {
        super(props);
        // Check if I need to bind handleClick.
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.noteClickCallback(this.props.noteInfo.noteID);
    }

    render() {
        const { locale, LL, setLocale }: typeof I18nContext = this.context;

        // Encapsulate LL...
        var osisRefRenderer = new OSISRefRenderer({
            getBookName: (bookName) => {
                return LL[bookName]();
            },
        });

        return (
            <StyledNoteItem>
                <StyledNoteAnchor
                    href="#"
                    id={this.props.noteInfo.noteID}
                    onClick={this.handleClick}>
                    {osisRefRenderer.render(this.props.osisRef.toString())}{' '}
                    -&nbsp;
                    {this.props.noteInfo.noteTitle}
                </StyledNoteAnchor>
            </StyledNoteItem>
        );
    }
}

export class Section extends React.Component<ISectionProps, ISectionState> {
    static contextType = I18nContext;

    constructor(props) {
        super(props);
        this.state = {
            isExpanded:
                this.props.isExpanded === undefined
                    ? true
                    : this.props.isExpanded,
            height:
                this.props.height === undefined ? undefined : this.props.height,
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    componentDidUpdate() {}

    toggleExpand() {
        this.setState((state) => {
            return { isExpanded: !state.isExpanded };
        });
    }

    render() {
        const { locale, LL, setLocale }: typeof I18nContext = this.context;

        var noteElements = null;
        if (this.props.notesNode.getNotes().length > 0) {
            // Generate notes.
            noteElements = this.props.notesNode
                .getNotes()
                .map((refNote, _index, _array) => {
                    return (
                        <NoteItem
                            noteInfo={refNote.noteInfo}
                            osisRef={refNote.osisRef}
                            noteClickCallback={this.props.noteClickCallback}
                        />
                    );
                });
        } // end if

        var sectionElements = [];
        if (this.props.notesNode.getChildren().size > 0) {
            var children = this.props.notesNode.getChildren();
            children.forEach((notesNode, id) => {
                var element = (
                    <Section
                        key={id}
                        id={id}
                        level={this.props.level + 1}
                        fetchDataCallback={this.props.fetchDataCallback}
                        noteClickCallback={this.props.noteClickCallback}
                        notesNode={notesNode}
                    />
                );
                sectionElements.push(element);
            });
        }

        var displayedElements = null;
        if (this.state.isExpanded) {
            displayedElements = (
                <>
                    {noteElements}
                    {sectionElements}
                </>
            );
        }

        if (this.props.id === 'root') {
            return (
                <StyledSection
                    className="section"
                    id={this.props.id}
                    height={this.props.height}>
                    {displayedElements}
                </StyledSection>
            );
        } else {
            return (
                <StyledSection
                    className="section"
                    id={this.props.id}
                    height={this.props.height}>
                    <StyledItemHeader>
                        <ExpandIcon
                            isExpanded={this.state.isExpanded}
                            onClick={this.toggleExpand}
                        />
                        <StyledTitle className="title">
                            {LL[this.props.id]()} (
                            {this.props.notesNode.notesCount()})
                        </StyledTitle>
                    </StyledItemHeader>
                    {displayedElements}
                </StyledSection>
            );
        }
    } // end render
}

export class BibleHierarchy extends React.Component<
    IBibleHierarchyProps,
    IBibleHierarchyState
> {
    titleRef: React.RefObject<HTMLSpanElement>;

    static contextType = I18nContext;

    constructor(props) {
        super(props);

        this.state = {
            notesTree: BibleHierarchy.notesToNotesTree(this.props.notes),
            rootHeight:
                this.props.rootHeight === undefined
                    ? undefined
                    : this.props.rootHeight,
        };

        this.titleRef = React.createRef();
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
    }

    static notesToNotesTree(notesWithRefs: NoteWithRefs[]): NotesTreeStore {
        var notesTree = new NotesTreeStore();

        if (!notesWithRefs) return notesTree;

        for (var i in notesWithRefs) {
            notesTree.addNoteWithRefs(notesWithRefs[i]);
        }
        return notesTree;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize() {
        // We must send the new value to the root element.
        this.setState({
            rootHeight: window.innerHeight - this.titleRef.current.clientHeight,
        });
        console.log(
            `Resize to ${
                window.innerHeight - this.titleRef.current.clientHeight
            }`,
        );
    }

    noteUpdate(noteWithRefsJSON): void {
        console.log('Note udpate function called', noteWithRefsJSON);
        let n: NoteWithRefs = NoteWithRefs.fromJSON(noteWithRefsJSON);

        this.setState((prevState) => {
            var notesTree = prevState.notesTree;
            notesTree.addNoteWithRefs(n);
            return { notesTree: notesTree };
        });
    }

    fetchData() {
        this.props.fetchDataCallback().then((data: NoteWithRefs[]) => {
            this.setState({ notesTree: BibleHierarchy.notesToNotesTree(data) });
        });
    }

    render() {
        const { locale, LL, setLocale }: typeof I18nContext = this.context;

        const MainTitle = styled(StyledTitle)`
            padding: 8px;
            align: center;
            font-size: 18px;
        `;
        return (
            <StyledRoot className="bible-hierarchy">
                <MainTitle className="title" ref={this.titleRef}>
                    {LL['Notes Bibliques']()}
                </MainTitle>
                <Section
                    key="root"
                    id="root"
                    level={0}
                    height={this.state.rootHeight}
                    isExpanded={true}
                    fetchDataCallback={this.fetchData}
                    noteClickCallback={this.props.noteClickCallback}
                    notesNode={this.state.notesTree}
                />
            </StyledRoot>
        );
    }

    componentDidMount(): void {
        this.props.noteUpdateWrapper(this.noteUpdate.bind(this));
        this.resize();
        this.fetchData();
    }
}
