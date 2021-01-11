import React from 'react';

import FeatureStore from './FeatureStore';

function ProjectPage() {
    return (
        <div className="w-screen h-screen-title bg-gray-900 flex flex-row">
            <div className="w-96 h-full">
                <FeatureStore></FeatureStore>
            </div>
            <div className="w-full h-full inset-shadow"></div>
        </div>
    );
}

export default ProjectPage;
