// src/mocks/handlers.js
import { rest } from 'msw'
import newsHandler from './handle-api/news';
import authHandler from './handle-api/auth';

export const handlers = [
  rest.get('/board/article/type', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(['안녕']),
    );
  }),

  ...newsHandler,
  ...authHandler,

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