import { applyMiddleware, createStore } from 'redux';
import reducer from './reducers';
import logger from 'redux-logger';

// let c: any;
// const cache = (store: any) => (next: any) => (action: any) => {
//     clearTimeout(c);
//     c = setTimeout(() => {
//         const state = JSON.stringify(store.getState());
//         window.localStorage.setItem('_cached_store', state);
//     }, 1000);
//     return next(action);
// };

// function load() {
//     const store = window.localStorage.getItem('_cached_store');
//     if (store) {
//         return JSON.parse(store);
//     }
//     return undefined;
// }

const store = createStore(reducer, applyMiddleware(logger));

export default store;
