import { Collapse } from '@material-ui/core';
import React from 'react';
import PythonApi, { ImageDataType } from '../resources/PythonApi';

import { ImageView } from '../UI/image';

function DataElement(props: { src: string }) {
    const { src } = props;
    const [open, setOpen] = React.useState(false);
    const [image, setImage] = React.useState<ImageDataType>([]);
    const imageContext = React.useRef<HTMLImageElement | null>(null);

    React.useEffect(() => {
        PythonApi.getDataByPathFromActiveDataset([src])
            .then((res) => {
                if (res) {
                    setImage(res);
                }
            })
            .catch((err) => {
                alert(err.message);
            });
    }, [src]);

    return (
        <div className="w-full h-32">
            <ImageView src={image} />
        </div>
    );
}

export default DataElement;
