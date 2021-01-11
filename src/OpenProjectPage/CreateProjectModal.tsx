import React from 'react';
import { IconButton, Modal } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { connect } from 'react-redux';
import { closeCreateProjectModal, createAndSetProject } from '../reducers/actions';
import { SelectInput, TextInput, TextInputWithButton } from '../UI/inputs';
import { getProjectConfigPath, openProjectPicker } from '../utils';
import { SquareButton } from '../UI/buttons';
import { CreateAndSetProjectPayload } from '../reducers/types';

const fs = window.require('fs');

type CreateProjectModalProps = {
    open: boolean;
};

const mapDispatch = { closeCreateProjectModal, createAndSetProject };

export const CreateProjectModal = connect(
    null,
    mapDispatch,
)((props: CreateProjectModalProps & typeof mapDispatch) => {
    // On press select workspace path
    const selectWorkspacePath = () => {
        const selection = openProjectPicker();

        if (selection) {
            // Check if already a project
            const config_path = getProjectConfigPath(selection[0]);
            console.log(config_path);
            if (fs.existsSync(config_path)) {
                alert('Folder is already a project. Please choose another path!');
                return;
            }

            // Update input element value
            const inputnode = document.getElementById('project-workspace-input') as HTMLInputElement;
            if (inputnode) {
                inputnode.value = selection[0];
            }
        }
    };

    // On form submit
    const createProject = () => {
        const project_name = (document.getElementById('project-name-input') as HTMLInputElement | null)?.value;
        const project_path = (document.getElementById('project-workspace-input') as HTMLInputElement | null)?.value;
        const project_goal = (document.getElementById('project-goal-select') as HTMLSelectElement | null)?.value;

        if (project_path && project_name && project_goal) {
            const createProjectPayload: CreateAndSetProjectPayload = {
                name: project_name,
                path: project_path,
                goal: project_goal,
            };
            props.createAndSetProject(createProjectPayload);
        }
    };

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
                    buttonProps={{ children: 'Select folder', onClick: selectWorkspacePath, type: 'button' }}
                    label="Workspace path"
                    inputProps={{ id: 'project-workspace-input' }}
                ></TextInputWithButton>

                <SelectInput label="What is your goal?" selectProps={{ id: 'project-goal-select' }}>
                    <option>Tracking</option>
                    <option>Segmentation</option>
                    <option>Classification</option>
                    <option>Regression</option>
                    <option>Other</option>
                </SelectInput>

                <TextInputWithButton
                    buttonProps={{ children: 'Pick dataset', type: 'button' }}
                    label="Select your dataset! (TBD)"
                    inputProps={{ id: 'project-dataset-input' }}
                ></TextInputWithButton>

                <SquareButton type="button" className="w-52 ml-auto mr-auto mt-9" onClick={createProject}>
                    Go!
                </SquareButton>
            </form>
        </Modal>
    );
});
