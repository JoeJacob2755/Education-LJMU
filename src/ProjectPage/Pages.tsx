import React from 'react';
import CanvasOverlay from './CanvasOverlay';

import { createEditor } from './node-editor/editor';
// @ts-ignore
import { Tab, Tabs } from 'react-draggable-tab';
import './node-editor/style.scss';
import { Project } from '../reducers/types';
import { connect } from 'react-redux';
import Canvas from './Canvas';
function Pages({ project }: { project: Project }) {
    const tabs = project.pages.map((page: typeof project.pages[0]) => (
        <Tab key={page} title={page}>
            <Canvas />
        </Tab>
    ));

    return (
        <div className="w-screen h-screen-title bg-white flex flex-row bg-gr">
            <Tabs tabAddButton={<div />}>{tabs}</Tabs>
        </div>
    );
}

export default connect((store) => ({ project: store.project }))(Pages);
