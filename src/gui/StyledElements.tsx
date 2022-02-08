import * as React from 'react';
const styled = require('styled-components').default;

export const StyledRoot = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const StyledNoteItem = styled.div`
    box-sizing: border-box;
    height: 30px;
    display: flex;
    flex-direction: row;
    transition: 0.1s;
    max-width: 100%;
    align-items: stretch;
    border-bottom: 1px solid grey;
`;

interface IStyledSectionProps {
    id: string;
    height?: number;
}

export const StyledSection = styled.div<IStyledSectionProps>`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow-y: ${(props) => (props.id === 'root' ? 'scroll' : 'visible')};
    overflow-x: ${(props) => (props.id === 'root' ? 'hidden' : 'visible')};
    height: ${(props: any) => (props.height ? props.height + 'px' : 'auto')};
`;

export const StyledBook = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    transition: 0.1s;
    margin-left: 16px;
`;

export const StyledNoteAnchor = styled.a`
    text-decoration: none;
    cursor: default;
    white-space: nowrap;
    display: flex;
    flex: 1;
    user-select: none;
    height: 100%;
    color: var(--joplin-color);
    align-items: center;
`;

export const StyledTitle = styled.span`
    font-weight: bold;
`;

export const StyledItemHeader = styled.div`
    flex-direction: row;
    align-items: center;
    display: flex;
    height: 30px;
    min-height: 30px;
`;

export function ExpandIcon(props: any) {
    const style: any = {
        width: 16,
        maxWidth: 16,
        opacity: 0.5,
        display: 'flex',
        justifyContent: 'center',
    };
    return (
        <i
            className={
                props.isExpanded ? 'fas fa-caret-down' : 'fas fa-caret-right'
            }
            onClick={props.onClick}
            style={style}></i>
    );
}
