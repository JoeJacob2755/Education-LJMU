import React, { useState } from 'react';
import CanvasOverlay from './CanvasOverlay';

import { createEditor } from './node-editor/editor';
// @ts-ignore
import { Tab, Tabs } from 'react-draggable-tab';
import './node-editor/style.scss';
import { Project } from '../reducers/types';
import { connect } from 'react-redux';

import Canvas from './Canvas';
import PageList from './PageList';
import { findAllProjectPages } from '../utils';

function Pages({ project }: { project: Project }) {
    const pages = findAllProjectPages(project.path);
    console.log(pages);

    const [activePage, setActivePage] = useState(0);

    return (
        <div className="w-screen h-screen-title flex flex-row bg-gray-900">
            <div className="w-80 h-screen-title bg-gray-800 flex flex-col">
                <PageList
                    pages={pages}
                    project={project}
                    activePage={activePage}
                    onSetActive={(_, i) => {
                        setActivePage(i);
                    }}
                ></PageList>
            </div>
            {pages.length ? (
                <Canvas key={activePage} page={activePage < pages.length ? pages[activePage] : pages[0]}></Canvas>
            ) : null}
        </div>
    );
}

export default connect((store) => ({ project: store.project }))(Pages);
