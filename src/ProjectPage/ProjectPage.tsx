import React from 'react';
import FeatureStore from './FeatureStore';

import { createEditor } from './node-editor/editor';

import './node-editor/style.css';

function ProjectPage() {
    return (
        <div className="w-screen h-screen-title bg-white flex flex-row">
            <div className="w-96 h-full">
                <FeatureStore></FeatureStore>
            </div>
            <div className="w-96 h-auto flex inset-shadow">
                <div className="App">
                    <div style={{ width: '100vw', height: '100vh' }} ref={(ref) => ref && createEditor(ref)} />
                </div>
            </div>
        </div>
    );
}

export default ProjectPage;
