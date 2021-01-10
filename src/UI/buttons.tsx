import React from 'react';

export function SquareButton(
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) {
    return (
        <button
            {...props}
            className={
                props.className + ' bg-green-700 p-2 text-xl rounded-md text-opacity-80 text-white hover:bg-green-600'
            }
        ></button>
    );
}
