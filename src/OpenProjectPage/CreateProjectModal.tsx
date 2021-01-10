import React from 'react';
import { IconButton, Modal } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { connect } from 'react-redux';
import { closeCreateProjectModal } from '../reducers/actions';
import { TextInput, TextInputWithButton } from '../UI/inputs';

type CreateProjectModalProps = {
    open: boolean;
};

const mapDispatch = { closeCreateProjectModal };

export const CreateProjectModal = connect(
    null,
    mapDispatch,
)((props: CreateProjectModalProps & typeof mapDispatch) => {
    return (
        <Modal open={props.open} onClose={props.closeCreateProjectModal}>
            <form className="w-screen h-screen absolute focus:outline-none bg-gray-900 p-20">
                <div className="-ml-12 -mt-8 mb-8">
                    <IconButton onClick={props.closeCreateProjectModal}>
                        <ArrowBack className="text-white" fontSize="large" />
                    </IconButton>
                </div>
                <h1 className="text-bread text-4xl text-white">Start a new project!</h1>

                <TextInput label="Project name" id="project-name-input"></TextInput>

                <TextInputWithButton
                    buttonProps={{ children: 'Select folder' }}
                    label="Workspace path"
                    id="project-workspace-input"
                ></TextInputWithButton>
            </form>
        </Modal>
    );
});
