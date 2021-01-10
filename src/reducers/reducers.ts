/*
 * All reducers should be defined here.
 */

import { State, Action, SET_PROJECT, OPEN_CREATE_PROJECT_MODAL, CLOSE_CREATE_PROJECT_MODAL } from './types';

const defaultState: State = {
    project: {},
    createProjectModalOpen: false,
};

function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case SET_PROJECT:
            return {
                ...state,
                project: action.payload,
            };
        case OPEN_CREATE_PROJECT_MODAL:
            return {
                ...state,
                createProjectModalOpen: true,
            };
        case CLOSE_CREATE_PROJECT_MODAL:
            return {
                ...state,
                createProjectModalOpen: false,
            };
        default:
            return state;
    }
}

export default reducer;
