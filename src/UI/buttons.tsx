import React from 'react';

export function SquareButton(
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) {
    return (
        <button
            {...props}
            className={
                props.className +
                ' p-1 mx-2 rounded-md text-opacity-80 text-white text-bread border-2 border-green-600 hover:border-green-500 focus:border-green-400 focus:outline-none'
            }
        ></button>
    );
}
