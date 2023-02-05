// src/mocks/browser.js
import { setupWorker } from 'msw'
import { getHandlers } from './handlers'

// This configures a Service Worker with the given request handlers.
/** @type {import('./handlers').UserTable} */
const userTable = {
    ssafy: {
        role: 'admin',
        userId: 'ssafy',
        userPassword: 'ssafy',
        address: '서울특별시 강동구',
        phoneNumber: '010-1234-5678',
        userName: '김싸피',
    }
};

export const worker = setupWorker(...getHandlers(userTable));