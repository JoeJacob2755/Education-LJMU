/*
 * All reducers should be defined here.
 */

import { saveProjectToLS } from '../utils';
import {
    State,
    Action,
    SET_PROJECT,
    OPEN_CREATE_PROJECT_MODAL,
    CLOSE_CREATE_PROJECT_MODAL,
    ADD_PAGE_TO_PROJECT,
    Project,
} from './types';

const defaultState: State = {
    project: {},
    createProjectModalOpen: false,
};

function projectReducer(state: Project = {}, action: Action): Project {
    switch (action.type) {
        case ADD_PAGE_TO_PROJECT:
            state = { ...state };
            state.pages = [...state.pages, action.payload.page];
            saveProjectToLS(state);
            return state;
        default:
            return state;
    }
}

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
            return { ...state, project: projectReducer(state.project, action) };
    }
}

export default reducer;
