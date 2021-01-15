import React from 'react';

export function SquareButton(
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) {
    return (
        <button
            {...props}
            className={
                props.className +
                ' p-1 px-4 mx-2 rounded-md text-opacity-80 text-white text-bread border-2 border-green-600 hover:border-green-500 focus:border-green-400 focus:outline-none'
            }
        ></button>
    );
}

export function RoundedButton(
    props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
) {
    return (
        <button
            {...props}
            className={
                props.className +
                ' p-2 mx-2 rounded-full text-opacity-80 text-white text-bread focus:outline-none bg-gradient-to-r from-blue-500 to-blue-900 focus:from-blue-300 hover:from-blue-400'
            }
        ></button>
    );
}
