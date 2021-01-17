import React from 'react';
import { IconButton, Modal } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { connect } from 'react-redux';
import { closeCreateProjectModal, createAndSetProject } from '../reducers/actions';
import { InlineSelectInput, SelectInput, TextInput, TextInputWithButton } from '../UI/inputs';
import { getProjectConfigPath, openProjectPicker } from '../utils';
import { SquareButton } from '../UI/buttons';
import { CreateAndSetProjectPayload } from '../reducers/types';
import { FloatingCard } from '../UI/cards';

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
            <div
                className=" w-screen mt-20 h-full rounded-t-3xl focus:outline-none bg-gradient-to-tr from-gray-900 to-gray-800 text-white"
                style={{ flexGrow: 1, flexShrink: 1 }}
            >
                <div className="flex flex-col pt-16 h-96 bg-gradient-to-tr gradient-lg animate-gradient-x animation-running-hover rounded-t-3xl from-blue-500 via-green-700 to-pink-600">
                    <h1 className="place-self-center text-bread font-semibold text-5xl ">Start a new project!</h1>
                    <p className="place-self-center text-bread font-thin mt-6">
                        Employ deep learning to analyze your data.
                    </p>
                </div>
                <div className="absolute top-24 left-5">
                    <IconButton onClick={props.closeCreateProjectModal}>
                        <ArrowBack className="text-white" fontSize="large" />
                    </IconButton>
                </div>
                <div className="flex flex-row place-content-center justify-evenly">
                    <FloatingCard className="min-w-min w-4/12 h-4/6 -mt-32 bg-gray-800">
                        <form className="w-full text-white">
                            <h1 className="text-bread text-3xl text-white">Configure the project.</h1>
                            <TextInput required={true} label="Project name" id="project-name-input"></TextInput>

                            <TextInputWithButton
                                buttonProps={{
                                    children: 'Select folder',
                                    onClick: selectWorkspacePath,
                                    type: 'button',
                                }}
                                label="Workspace path"
                                inputProps={{ id: 'project-workspace-input', required: true }}
                            ></TextInputWithButton>

                            <SelectInput label="What is your goal?" selectProps={{ id: 'project-goal-select' }}>
                                <option>Tracking</option>
                                <option>Segmentation</option>
                                <option>Classification</option>
                                <option>Regression</option>
                                <option>Other</option>
                            </SelectInput>

                            <SquareButton type="button" className="w-52 ml-auto mr-auto mt-9" onClick={createProject}>
                                Go!
                            </SquareButton>
                        </form>
                    </FloatingCard>
                    <FloatingCard className="min-w-min w-4/12 -mt-32 bg-gray-800 blue">
                        <div className="flex-grow" style={{ flexGrow: 2, flexShrink: 0 }}>
                            <h1 className="text-bread text-3xl text-white">Add your dataset.</h1>
                            <div className="text-bread w-full mt-4">
                                <span>My dataset consists of</span>
                                <InlineSelectInput selectProps={{ id: 'project-dataset-plurality' }}>
                                    <option>several</option>
                                    <option>a single</option>
                                </InlineSelectInput>
                                <span>file(s), each of which contains</span>
                                <InlineSelectInput
                                    selectProps={{
                                        defaultValue: 'a single',
                                        id: 'project-dataset-plurality',
                                    }}
                                >
                                    <option>several</option>
                                    <option>a single</option>
                                </InlineSelectInput>
                                <InlineSelectInput selectProps={{ id: 'project-dataset-type' }}>
                                    <option>image(s)</option>
                                    <option>video(s)</option>
                                </InlineSelectInput>
                                <span className="whitespace-pre">.</span>
                            </div>
                        </div>
                    </FloatingCard>
                </div>
            </div>
        </Modal>
    );
});
