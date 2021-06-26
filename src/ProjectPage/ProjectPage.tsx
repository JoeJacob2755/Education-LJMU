import React from 'react';
import Canvas from './Canvas';
import CanvasOverlay from './CanvasOverlay';

import { createEditor } from './node-editor/editor';

import './node-editor/style.scss';
import Pages from './Pages';

function ProjectPage() {
    return <Pages></Pages>;
}

export default ProjectPage;
