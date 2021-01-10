/*
 * All reducers should be defined here.
 */

import { State, Action, SET_PROJECT } from './types';

const defaultState: State = {
    project: {},
};

function reducer(state: State = defaultState, action: Action): State {
    switch (action.type) {
        case SET_PROJECT:
            return {
                ...state,
                project: action.payload,
            };
        default:
            return state;
    }
}

export default reducer;
