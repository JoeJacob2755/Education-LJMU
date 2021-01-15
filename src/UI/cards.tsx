import React from 'react';

export function FloatingCard(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <div {...props} className={props.className + ' shadow-lg z-10 bg-gray-800 p-7 rounded-3xl'}>
            {props.children}
        </div>
    );
}
