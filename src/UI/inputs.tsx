// import { FormControl, Input, InputLabel, InputProps } from '@material-ui/core';
import React from 'react';

export function TextInput(
    props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { label: string },
) {
    return (
        <div className="my-8 text-white flex flex-col">
            <label htmlFor={props.id} className="text-bread py-2">
                {props.label}
            </label>
            <input
                {...props}
                className={
                    props.className +
                    ' bg-gray-800 w-3/4 max-w-sm py-2 pl-2 text-bread text-base focus:outline-none focus:border-b-2'
                }
            ></input>
        </div>
    );
}
