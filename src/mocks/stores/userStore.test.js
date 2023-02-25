import { createStore, userReducer } from "./userStore";
/**
 * @typedef {import("../api/auth").User} User
 */

it("userStore action: SET", () => {
    const userStore = createStore(userReducer, {});

    /** @type {User} */
    const newUser = {
        role: 'admin',
        userId: 'ssafy',
        userPassword: 'ssafy',
        address: '서울특별시 서초구',
        phoneNumber: '010-1234-5678',
        userName: '김싸피',
    };

    userStore.dispatch({type: 'SET', payload: newUser});
    const state = userStore.getState();

    expect(state).toEqual({ [newUser.userId]: {...newUser} });
});

it("userStore action: REMOVE", () => {
    const userStore = createStore(userReducer, {});

    /** @type {User} */
    const newUser = {
        role: 'admin',
        userId: 'ssafy',
        userPassword: 'ssafy',
        address: '서울특별시 서초구',
        phoneNumber: '010-1234-5678',
        userName: '김싸피',
    };

    userStore.dispatch({type: 'SET', payload: newUser});
    userStore.dispatch({type: 'REMOVE', payload: newUser.userId});
    const state = userStore.getState();

    expect(state).toEqual({});
});
