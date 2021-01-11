import React from 'react';
import './App.css';
import './UI/styles.css';
import 'tailwindcss/tailwind.css';
import { connect } from 'react-redux';
import { State } from './reducers/types';
import OpenProjectPage, { CreateProjectModal } from './OpenProjectPage/';
import ProjectPage from './ProjectPage/';

function App(props: State) {
    return (
        <>
            {props.project.id ? <ProjectPage></ProjectPage> : <OpenProjectPage></OpenProjectPage>}
            <CreateProjectModal open={props.createProjectModalOpen}></CreateProjectModal>
        </>
    );
}

const mapStateToProps = (state: State) => {
    return state;
};

export default connect(mapStateToProps)(App);
