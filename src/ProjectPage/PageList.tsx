import React from 'react';
import CanvasOverlay from './CanvasOverlay';

import { createEditor } from './node-editor/editor';
// @ts-ignore
import { Tab, Tabs } from 'react-draggable-tab';
import './node-editor/style.scss';
import { Project } from '../reducers/types';
import { connect } from 'react-redux';
import Canvas from './Canvas';
import { findAllProjectPages } from '../utils';
import { normalize, sep, dirname, basename } from 'path';
import { relative } from 'path';

function PageItem({
    path,
    active,
    onClick,
}: {
    path: string;
    active: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}) {
    let normpath = normalize(path);
    let dir = dirname(normpath);
    let filename = basename(normpath).split('.')[0];

    const bg_color = active
        ? ' bg-gray-700'
        : ' bg-transparent hover:bg-gray-800 hover:text-gray-100 hover:bg-opacity-70';
    console.log(bg_color);
    return (
        <div onClick={onClick} className={'text-gray-300 pl-5 select-none w-full  ' + bg_color}>
            <span>{filename}</span>
            <span className="float-right pr-5 opacity-30 text-sm">{dir}</span>
        </div>
    );
}

function PageList({
    project,
    activePage,
    pages,
    onSetActive,
}: {
    project: Project;
    activePage: number;
    pages: string[];
    onSetActive: (page: string, index: number) => void;
}) {
    return (
        <div className="m-2 h-1/4 bg-gray-900 bg-opacity-70 pl-0 pt-0 overflow-y-auto">
            <ul>
                {pages.map((path, i) => (
                    <PageItem
                        key={path}
                        path={relative(project.path, path)}
                        active={i == activePage}
                        onClick={() => onSetActive(path, i)}
                    ></PageItem>
                ))}
            </ul>
        </div>
    );
}

export default PageList;
