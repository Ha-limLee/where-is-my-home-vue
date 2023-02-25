// @ts-check

const initialState = (typeof sessionStorage === "undefined") ? {} : sessionStorage.getItem("userTable");

/**
 * @typedef {import("../api/auth").User} User
 * @typedef {import("../api/auth").UserTable} UserTable
 */

/**
 * @typedef {{type: 'SET'; payload: User}} SetAction
 * @typedef {{type: 'REMOVE'; payload: string}} RemoveAction
 * @typedef {SetAction | RemoveAction} UserAction
 */

/** @type {(state: UserTable | {}, action?: UserAction) => UserTable} */
export const userReducer = (state, action) => {
    switch (action?.type) {
        case 'SET':
            const user = action.payload;
            return {
                ...state,
                [user.userId]: user,
            };
        case 'REMOVE':
            const userId = action.payload;
            delete state[userId];
            return { ...state };
        default:
            return state;
    }
};

/**
 * @param {typeof userReducer} reducer 
 * @param {{}} initialState
 */
export const createStore = (reducer, initialState) => {
    let listeners = [];
    let state = reducer(initialState);
    return {
        getState: () => state,
        /**
         * @param {UserAction} action 
         */
        dispatch: (action) => {
            state = reducer(state, action);
            listeners.forEach(listener => {
                listener(state);
            });
        },
        /** @type {(newListener: (state: UserTable) => void) => () => void} */
        subscribe: (newListener) => {
            listeners.push(newListener);
            const unsubscribe = () => {
                listeners = listeners.filter(l => l !== newListener);
            };
            return unsubscribe;
        }
    };
};

const userStore = createStore(userReducer, initialState);
userStore.subscribe((state) => {
    sessionStorage.setItem("userTable", JSON.stringify(state));
});

export {userStore};