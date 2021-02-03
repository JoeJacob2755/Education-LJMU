import React from 'react';
import { ImageDataType } from '../resources/PythonApi';

export function ImageView(props: { src: ImageDataType }) {
    const [channel, setChannel] = React.useState(0);

    const { src } = props;
    let data;
    if (src.length >= 1) {
        data = 'data:image/bmp;base64, ' + src[channel].data.toString('base64');
    } else {
        data = '';
    }

    return (
        <div className="image--container w-full h-full relative">
            <div className="image--overlay absolute left-0 right-0 top-0 bottom-0 pointer-events-none"></div>
            <img className="image--img w-full h-full object-center object-cover overflow-hidden" src={data} />
        </div>
    );
}
