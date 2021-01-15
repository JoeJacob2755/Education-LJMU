// import { FormControl, Input, InputLabel, InputProps } from '@material-ui/core';
import React, { ReactNode } from 'react';
import { SquareButton } from './buttons';

export function TextInput(
    props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & { label: string },
) {
    return (
        <div className="my-8 text-white flex flex-col ">
            <label htmlFor={props.id} className="text-bread py-2">
                {props.label}
            </label>
            <div className="flex">
                <input
                    {...props}
                    className={
                        props.className +
                        ' text-input bg-gray-700 py-2 pl-2 text-bread text-base focus:outline-none flex-grow'
                    }
                ></input>
            </div>
        </div>
    );
}

type TextInputWithButtonProps = {
    label: string;
    inputProps: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    buttonProps: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
};

export function TextInputWithButton(props: TextInputWithButtonProps) {
    const buttonprops = props.buttonProps || {};
    const inputprops = props.inputProps || {};
    return (
        <div className="my-8 text-white flex flex-col">
            <label htmlFor={inputprops.id} className="text-bread py-2">
                {props.label}
            </label>
            <div className="flex">
                <input
                    {...inputprops}
                    className={
                        inputprops.className +
                        ' text-input bg-gray-700 w-auto py-2 pl-2 text-bread text-base focus:outline-none flex-grow'
                    }
                ></input>
                <SquareButton {...buttonprops}> {buttonprops.children} </SquareButton>
            </div>
        </div>
    );
}

export function SelectInput(props: {
    label: string;
    children: ReactNode;
    selectProps: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
}) {
    return (
        <div className={'my-8 text-white flex flex-col w-3/4' + (props.label ? ' -translate-y-20' : '')}>
            {props.label ? (
                <label htmlFor={props.selectProps.id} className="text-bread py-2">
                    {props.label}
                </label>
            ) : null}

            <div className="flex">
                <select
                    {...props.selectProps}
                    className={
                        props.selectProps.className +
                        ' text-input bg-gray-700 w-auto py-2 pl-2 text-bread text-base focus:outline-none flex-grow'
                    }
                >
                    {props.children}
                </select>
            </div>
        </div>
    );
}

export function InlineSelectInput(props: {
    children: ReactNode;
    selectProps: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
}) {
    return (
        <select
            {...props.selectProps}
            className={
                props.selectProps.className +
                ' m-1 inline text-input bg-gray-700 w-auto py-2 pl-2 text-bread text-base focus:outline-none flex-grow'
            }
        >
            {props.children}
        </select>
    );
}
