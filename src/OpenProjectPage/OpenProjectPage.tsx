import React from 'react';
import { connect } from 'react-redux';
import { SquareButton } from '../UI/buttons';

function ProjectPage(props: typeof mapDispatch) {
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
