import React from 'react';
import CanvasOverlay from './CanvasOverlay';
import FeatureStore from './CanvasOverlay';

import { createEditor } from './node-editor/editor';

import './node-editor/style.css';

function ProjectPage() {
    return (
        <div className="w-screen h-screen-title bg-white flex flex-row bg-gr">
            <div className="App w-full h-full flex inset-shadow">
                <div ref={(ref) => ref && createEditor(ref)} />
            </div>
            <CanvasOverlay></CanvasOverlay>
        </div>
    );
}

export default ProjectPage;
