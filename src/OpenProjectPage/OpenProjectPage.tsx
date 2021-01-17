import React from 'react';
import { connect } from 'react-redux';
import { openCreateProjectModal, setProject } from '../reducers/actions';
import { RoundedButton } from '../UI/buttons';
import { loadProject, openProjectFilePicker } from '../utils';

import logo from '../resources/logo512.png';

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
        <header className="h-screen-title bg-gradient-to-tr from-gray-900 to-gray-800 bg-blue-500 flex flex-col items-center justify-center">
            <img className="w-72 h-72 inline-block " src={logo}></img>
            <div className="flex h-72 place-items-center">
                <h1 className=" text-gray-300 p-10 select-none text-title">DEEPTRACK</h1>
            </div>
            <div className="h-40"></div>
            <div className="justify-self-end h-32">
                <RoundedButton className="w-96 mr-10 text-bread" onClick={props.openCreateProjectModal}>
                    Create a new project!
                </RoundedButton>
                <RoundedButton className="w-96 ml-10 text-bread" onClick={openExistingProject}>
                    Load an existing project
                </RoundedButton>
            </div>
        </header>
    );
}

export default connect(null, mapDispatch)(OpenProjectPage);
