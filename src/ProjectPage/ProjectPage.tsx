import React from 'react';
import FeatureStore from './FeatureStore';

import { createEditor } from './node-editor/editor';

import './node-editor/style.css';

function ProjectPage() {
    return (
        <div className="w-screen h-screen-title bg-white flex flex-row bg-red">
            <div className="w-96 h-full">
                <FeatureStore></FeatureStore>
            </div>
            <div className="App w-full h-full flex inset-shadow">
                <div ref={(ref) => ref && createEditor(ref)} />
            </div>
        </div>
    );
}

export default ProjectPage;