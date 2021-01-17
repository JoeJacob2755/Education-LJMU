import React from 'react';

export function FloatingCard(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const bg = props.className;
    return (
        <div {...props} className={props.className + ' shadow-lg z-10 p-7 rounded-3xl'}>
            {props.children}
        </div>
    );
}
