import React from 'react';
import CanvasOverlay from './CanvasOverlay';
import { createEditor } from './node-editor/editor';

function Canvas({ page }: { page: string }) {
    return (
        <div className="App w-full h-full flex">
            <div className="App w-full h-full flex inset-shadow">
                <div ref={(ref) => ref && createEditor(ref, page)} />
            </div>
            <CanvasOverlay></CanvasOverlay>
        </div>
    );
}

export default Canvas;
