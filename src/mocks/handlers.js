// src/mocks/handlers.js
import { rest } from 'msw'
import newsHandler from './handle-api/news';
import getAuthHandler from './handle-api/auth';

/**
 * @typedef {import("./handle-api/auth").UserTable} UserTable
 */

export const getHandlers = (/** @type {UserTable} */ userTable) => [
  rest.get('/board/article/type', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['안녕']),
    );
  }),

  ...newsHandler,
  ...getAuthHandler(userTable),

  rest.get('/user', (req, res, ctx) => {
    // Check if the user is authenticated in this session
    const isAuthenticated = sessionStorage.getItem('is-authenticated')

    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        }),
      )
    }

    // If authenticated, return a mocked user details
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      }),
    )
  }),
]