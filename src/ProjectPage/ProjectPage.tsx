import React from 'react';
import { connect } from 'react-redux';
import { openCreateProjectModal, setProject } from '../reducers/actions';
import { SquareButton } from '../UI/buttons';
import { loadProject, openProjectFilePicker } from '../utils';

const mapDispatch = { openCreateProjectModal, setProject };

function OpenProjectPage(props: typeof mapDispatch) {
    const openExistingProject = () => {
        const results = openProjectFilePicker();
        if (results) {
            const project = loadProject(results[0]);
            if (project) {
                props.setProject(project);
            }
        }
    };

    return (
        <header className="h-screen-title bg-gray-900 flex flex-col items-center justify-center">
            <h1 className=" text-gray-300 p-10 select-none text-title">DEEPTRACK</h1>
            <SquareButton className="w-96 mb-5 text-bread" onClick={props.openCreateProjectModal}>
                Create a new project!
            </SquareButton>
            <SquareButton className="w-96 text-bread" onClick={openExistingProject}>
                Load an existing project
            </SquareButton>
        </header>
    );
}

export default connect(null, mapDispatch)(OpenProjectPage);
