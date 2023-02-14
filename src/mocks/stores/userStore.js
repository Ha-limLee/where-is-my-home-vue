const initialState = {};

/**
 * @typedef {import("../handle-api/auth").User} User
 * @typedef {import("../handle-api/auth").UserTable} UserTable
 */

/**
 * @typedef {{type: 'SET', payload: User}} UserAction
 */

/**
 * @param {UserTable} state 
 * @param {UserAction} action 
 * @returns {UserTable}
 */
const userReducer = (state = initialState, action) => {
    switch (action.type) {
       case 'SET':
        const {payload} = action;
        return {
            ...state,
            [payload.userId]: payload,
        };
        default:
            return state;
    }
};

/**
 * @param {typeof userReducer} reducer 
 */
const createStore = (reducer) => {
    let listeners = [];
    let state = reducer(undefined, {});
    return {
        getState: () => state,
        /**
         * @param {UserAction} action 
         */
        dispatch: (action) => {
            state = reducer(state, action);
            listeners.forEach(listener => {
                listener();
            });
        },
        subscribe: (newListener) => {
            listeners.push(newListener);
            const unsubscribe = () => {
                listeners = listeners.filter(l => l !== newListener);
            };
            return unsubscribe;
        }
    };
};

export const userStore = createStore(reducer);
