import React from 'react';
import './App.css';
import 'tailwindcss/tailwind.css';
import { connect } from 'react-redux';
import { State } from './reducers/types';
import OpenProjectPage from './OpenProjectPage/';

function App(props: Record<string, unknown>) {
    if (props.project !== {}) {
        return <OpenProjectPage></OpenProjectPage>;
    } else {
        return <OpenProjectPage></OpenProjectPage>;
    }
}

const mapStateToProps = (state: State) => {
    return {
        project: state.project,
    };
};

export default connect(mapStateToProps)(App);
