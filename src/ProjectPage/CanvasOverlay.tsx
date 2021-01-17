import { Slider } from '@material-ui/core';
import { ZoomIn, ZoomOut } from '@material-ui/icons';
import React from 'react';
import { FloatingCard } from '../UI/cards';

function CanvasOverlay() {
    return (
        <div className="absolute w-full h-full left-0 top-0 pointer-events-none">
            <div className="w-screen flex place-content-center">
                <FloatingCard className="pointer-events-auto whitespace-nowrap mx-20 absolute flex text-white text-bread justify-center content-center items-center bottom-10 h-14 m-auto bg-gray-700">
                    LOREM IPSUM... Control panel here!
                </FloatingCard>
            </div>
        </div>
    );
}

export default CanvasOverlay;
