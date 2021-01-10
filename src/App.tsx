import React from 'react';
import './App.css';
import './UI/styles.css';
import 'tailwindcss/tailwind.css';
import { connect } from 'react-redux';
import { State } from './reducers/types';
import OpenProjectPage, { CreateProjectModal } from './OpenProjectPage/';

function App(props: State) {
    if (props.project !== {}) {
        return (
            <>
                <OpenProjectPage></OpenProjectPage>{' '}
                <CreateProjectModal open={props.createProjectModalOpen}></CreateProjectModal>
            </>
        );
    } else {
        return <OpenProjectPage></OpenProjectPage>;
    }
}

const mapStateToProps = (state: State) => {
    return state;
};

export default connect(mapStateToProps)(App);
