import React from 'react';
// import { ImageDataType } from '../resources/PythonApi';

export function ImageView(props: { src: unknown }) {
    return (
        <div className="image--container w-full h-full relative">
            <div className="image--overlay absolute left-0 right-0 top-0 bottom-0 pointer-events-none"></div>
            {/* <img className="image--img w-full h-full object-center object-cover overflow-hidden" src={data} /> */}
        </div>
    );
}
