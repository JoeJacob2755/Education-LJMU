// import { FormControl, Input, InputLabel, InputProps } from '@material-ui/core';
import React from 'react';
import { SquareButton } from './buttons';

export function TextInput(
    props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { label: string },
) {
    return (
        <div className="my-8 text-white flex flex-col w-3/4 max-w-lg">
            <label htmlFor={props.id} className="text-bread py-2">
                {props.label}
            </label>
            <div className="flex">
                <input
                    {...props}
                    className={
                        props.className +
                        ' text-input bg-gray-800 py-2 pl-2 text-bread text-base focus:outline-none flex-grow'
                    }
                ></input>
            </div>
        </div>
    );
}

type TextInputWithButtonExtraProps = {
    label: string;
    buttonProps: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
};

export function TextInputWithButton(
    props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
        TextInputWithButtonExtraProps,
) {
    const buttonProps = props.buttonProps || {};
    return (
        <div className="my-8 text-white flex flex-col w-3/4 max-w-lg">
            <label htmlFor={props.id} className="text-bread py-2">
                {props.label}
            </label>
            <div className="flex">
                <input
                    {...props}
                    className={
                        props.className +
                        ' text-input bg-gray-800 w-auto py-2 pl-2 text-bread text-base focus:outline-none flex-grow'
                    }
                ></input>
                <SquareButton {...buttonProps}> {buttonProps.children} </SquareButton>
            </div>
        </div>
    );
}
