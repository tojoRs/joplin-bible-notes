import * as React from 'react';
import { hierarchy } from '../models/hierarchy';
import { NoteInfo, NotesByOSISRef } from '../FetchDataResult';
import { OSISRef } from '../models/OSISRef';
const styled = require('styled-components').default;
import {
    ExpandIcon,
    StyledBook,
    StyledItemHeader,
    StyledNoteAnchor,
    StyledNoteItem,
    StyledRoot,
    StyledSection,
    StyledTitle,
} from './StyledElements';

interface ISectionProps {
    id: string;
    tree?: any;
    label?: string;
    notes?: NotesByOSISRef[];
    height?: number;
    isExpanded?: boolean;
    fetchDataCallback: Function;
    noteClickCallback: Function;
}

interface IBookProps {
    id: string;
    tree?: any;
    label: string;
    isExpanded?: boolean;
    notes?: NotesByOSISRef[];
    fetchDataCallback: Function;
    noteClickCallback: Function;
}

interface IBookState {
    notes: NotesByOSISRef[];
    isExpanded?: boolean;
}

interface ISectionState {
    notes: NotesByOSISRef[];
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
    notes?: NotesByOSISRef[];
}

interface IBibleHierarchyState {
    notes?: NotesByOSISRef[];
    rootHeight?: number;
}

export class NoteItem extends React.Component<INoteProps> {
    constructor(props) {
        super(props);
        // Check if I need to bind handleClick.
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.noteClickCallback(this.props.noteInfo.noteID);
    }

    render() {
        return (
            <StyledNoteItem>
                <StyledNoteAnchor
                    href="#"
                    id={this.props.noteInfo.noteID}
                    onClick={this.handleClick}>
                    {this.props.osisRef.getHumanReadableString('fr')} -&nbsp;
                    {this.props.noteInfo.noteTitle}
                </StyledNoteAnchor>
            </StyledNoteItem>
        );
    }
}

export class Book extends React.Component<IBookProps, IBookState> {
    constructor(props) {
        super(props);
        this.state = {
            notes: this.props.notes === undefined ? [] : this.props.notes,
            isExpanded:
                this.props.isExpanded === undefined
                    ? true
                    : this.props.isExpanded,
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand() {
        this.setState((state) => {
            return { isExpanded: !state.isExpanded };
        });
    }

    render() {
        if (this.props.notes.length == 0) return null;
        else {
            // Generate notes.
            var noteElements = this.props.notes.map((notes, _index, _array) => {
                var osisRef = notes.osisRef;
                var osisRefElements = notes.notes.map((noteInfo, i, a) => {
                    return (
                        <NoteItem
                            noteInfo={noteInfo}
                            osisRef={osisRef}
                            noteClickCallback={this.props.noteClickCallback}
                        />
                    );
                });
                return <>{osisRefElements}</>;
            });

            return (
                <StyledBook className="book">
                    <StyledItemHeader>
                        <ExpandIcon
                            isExpanded={this.state.isExpanded}
                            onClick={this.toggleExpand}
                        />
                        <StyledTitle className="title">
                            {this.props.label} ({this.props.notes.length})
                        </StyledTitle>
                    </StyledItemHeader>
                    {this.state.isExpanded == true ? noteElements : null}
                </StyledBook>
            );
        }
    }
} // end class Book

export class Section extends React.Component<ISectionProps, ISectionState> {
    constructor(props) {
        super(props);
        this.state = {
            notes: this.props.notes === undefined ? [] : this.props.notes,
            isExpanded:
                this.props.isExpanded === undefined
                    ? true
                    : this.props.isExpanded,
            height:
                this.props.height === undefined ? undefined : this.props.height,
        };
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    componentDidUpdate() {
        console.log(this.props.label + ' section updated.');
    }

    toggleExpand() {
        this.setState((state) => {
            return { isExpanded: !state.isExpanded };
        });
    }

    render() {
        var lHierarchy = this.props.tree;
        const elements = Object.keys(lHierarchy.elements).map((elementId) => {
            if (lHierarchy.elements[elementId].type === 'section') {
                return (
                    <Section
                        key={elementId}
                        id={elementId}
                        label={lHierarchy.elements[elementId].label}
                        tree={lHierarchy.elements[elementId]}
                        fetchDataCallback={this.props.fetchDataCallback}
                        noteClickCallback={this.props.noteClickCallback}
                        notes={this.props.notes}
                    />
                );
            } else if (lHierarchy.elements[elementId].type === 'book') {
                // Generate the notes for this book
                var notes = this.props.notes.filter((notesByOSISRef) => {
                    return notesByOSISRef
                        .referenceString()
                        .startsWith(elementId);
                });
                return (
                    <Book
                        key={elementId}
                        id={elementId}
                        label={lHierarchy.elements[elementId].label}
                        tree={lHierarchy.elements[elementId]}
                        fetchDataCallback={this.props.fetchDataCallback}
                        noteClickCallback={this.props.noteClickCallback}
                        notes={notes}
                    />
                );
            }
        });

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
                        {lHierarchy.label}
                    </StyledTitle>
                </StyledItemHeader>
                {this.state.isExpanded == true ? elements : null}
            </StyledSection>
        );
    }
}

export class BibleHierarchy extends React.Component<
    IBibleHierarchyProps,
    IBibleHierarchyState
> {
    titleRef: React.RefObject<HTMLSpanElement>;

    constructor(props) {
        super(props);
        this.state = {
            notes: this.props.notes === undefined ? [] : this.props.notes,
            rootHeight:
                this.props.rootHeight === undefined
                    ? undefined
                    : this.props.rootHeight,
        };

        this.titleRef = React.createRef();
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    updateData(data: NotesByOSISRef[], updateQuery: string): void {
        // Propagate the received state to the children.
        // TODO Fix according to the updateQuery string.
        // Here, it's easy when we replace all...
        this.setState({ notes: data });
    }

    resize() {
        // We must send the new value to the root element.
        this.setState({
            rootHeight: window.innerHeight - this.titleRef.current.clientHeight,
        });
        console.log(
            'Resize to ',
            window.innerHeight - this.titleRef.current.clientHeight,
        );
    }

    fetchData() {
        this.props.fetchDataCallback().then((data: NotesByOSISRef[]) => {
            this.updateData(data, '_all_');
        });
    }

    render() {
        const MainTitle = styled(StyledTitle)`
            padding: 8px;
            align: center;
            font-size: 18px;
        `;

        return (
            <StyledRoot className="bible-hierarchy">
                <MainTitle className="title" ref={this.titleRef}>
                    Notes bibliques
                </MainTitle>
                <Section
                    key="root"
                    id="root"
                    height={this.state.rootHeight}
                    isExpanded={true}
                    label={hierarchy.label}
                    tree={hierarchy}
                    fetchDataCallback={this.fetchData}
                    noteClickCallback={this.props.noteClickCallback}
                    notes={this.state.notes}
                />
            </StyledRoot>
        );
    }

    componentDidMount(): void {
        this.props.noteUpdateWrapper(this.fetchData.bind(this));
        this.resize();
        this.fetchData();
    }
}
