import React from 'react';
import CanvasOverlay from './CanvasOverlay';
import { createEditor } from './node-editor/editor';

function Canvas() {
    return (
        <div>
            <div className="App w-full h-full flex inset-shadow">
                <div ref={(ref) => ref && createEditor(ref)} />
            </div>
            <CanvasOverlay></CanvasOverlay>
        </div>
    );
}

export default Canvas;
